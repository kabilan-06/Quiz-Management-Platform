package com.kabilan.assessment.arena;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Thread-safe multiplayer quiz arena manager.
 * Handles participant sessions, real-time atomic scoring, streak multipliers,
 * and high-throughput STOMP leaderboard broadcasting.
 */
@Component
public class ArenaRoomManager {

    private static final Logger log = LoggerFactory.getLogger(ArenaRoomManager.java);

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, ArenaRoom> activeRooms = new ConcurrentHashMap<>();

    public ArenaRoomManager(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public enum RoomStatus {
        LOBBY_WAITING,
        ROUND_ACTIVE,
        ROUND_REVIEW,
        MATCH_FINISHED
    }

    public record Participant(
            String userId,
            String username,
            AtomicInteger score,
            AtomicInteger consecutiveStreak,
            AtomicInteger integrityViolations,
            double trustScore,
            Instant joinedAt
    ) {}

    public record LeaderboardEntry(
            int rank,
            String userId,
            String username,
            int score,
            int streak,
            double trustScore
    ) {}

    public record LeaderboardBroadcast(
            String roomId,
            String eventType,
            RoomStatus status,
            List<LeaderboardEntry> leaderboard,
            Instant timestamp
    ) {}

    public static class ArenaRoom {
        private final String roomId;
        private final String roomTitle;
        private volatile RoomStatus status = RoomStatus.LOBBY_WAITING;
        private final Map<String, Participant> participants = new ConcurrentHashMap<>();
        private final Instant createdAt = Instant.now();

        public ArenaRoom(String roomId, String roomTitle) {
            this.roomId = roomId;
            this.roomTitle = roomTitle;
        }

        public String getRoomId() { return roomId; }
        public String getRoomTitle() { return roomTitle; }
        public RoomStatus getStatus() { return status; }
        public void setStatus(RoomStatus status) { this.status = status; }
        public Map<String, Participant> getParticipants() { return participants; }
    }

    /**
     * Creates or retrieves an active room.
     */
    public ArenaRoom getOrCreateRoom(String roomId, String roomTitle) {
        return activeRooms.computeIfAbsent(roomId, id -> new ArenaRoom(id, roomTitle != null ? roomTitle : "Arena " + id));
    }

    /**
     * Registers a participant joining the arena.
     */
    public void joinRoom(String roomId, String userId, String username) {
        ArenaRoom room = getOrCreateRoom(roomId, null);
        Participant participant = new Participant(
                userId,
                username,
                new AtomicInteger(0),
                new AtomicInteger(0),
                new AtomicInteger(0),
                100.0,
                Instant.now()
        );
        room.getParticipants().put(userId, participant);
        log.info("User {} ({}) joined arena room {}", username, userId, roomId);
        broadcastLeaderboard(roomId, "USER_JOINED");
    }

    /**
     * Removes participant when disconnected or left.
     */
    public void leaveRoom(String roomId, String userId) {
        ArenaRoom room = activeRooms.get(roomId);
        if (room != null) {
            room.getParticipants().remove(userId);
            log.info("User {} left arena room {}", userId, roomId);
            broadcastLeaderboard(roomId, "USER_LEFT");
            if (room.getParticipants().isEmpty()) {
                activeRooms.remove(roomId);
            }
        }
    }

    /**
     * Records an answer submission, computes dynamic speed and streak bonus,
     * updates score atomically, and broadcasts fresh leaderboard to all clients.
     */
    public LeaderboardEntry submitAnswer(String roomId, String userId, boolean isCorrect, long latencyMs) {
        ArenaRoom room = activeRooms.get(roomId);
        if (room == null) {
            throw new IllegalArgumentException("Room does not exist: " + roomId);
        }

        Participant participant = room.getParticipants().get(userId);
        if (participant == null) {
            throw new IllegalArgumentException("Participant not in room: " + userId);
        }

        if (isCorrect) {
            int streak = participant.consecutiveStreak().incrementAndGet();
            // Base score: 1000 points. Speed bonus up to 500. Streak multiplier 10% per consecutive hit.
            int speedBonus = (int) Math.max(0, 500 - (latencyMs / 20));
            double streakMultiplier = 1.0 + Math.min(1.0, (streak - 1) * 0.10);
            int pointsEarned = (int) Math.round((1000 + speedBonus) * streakMultiplier);

            participant.score().addAndGet(pointsEarned);
        } else {
            participant.consecutiveStreak().set(0); // Reset streak on mistake
        }

        broadcastLeaderboard(roomId, "SCORE_UPDATE");
        return getLeaderboard(roomId).stream()
                .filter(e -> e.userId().equals(userId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Reports an anti-cheating window blur or clipboard injection event.
     */
    public void recordIntegrityViolation(String roomId, String userId, String violationType, double trustPenalty) {
        ArenaRoom room = activeRooms.get(roomId);
        if (room != null) {
            Participant participant = room.getParticipants().get(userId);
            if (participant != null) {
                participant.integrityViolations().incrementAndGet();
                log.warn("Integrity violation for user {} in room {}: {}", userId, roomId, violationType);
                broadcastLeaderboard(roomId, "INTEGRITY_ALERT");
            }
        }
    }

    /**
     * Generates the sorted, ranked leaderboard.
     */
    public List<LeaderboardEntry> getLeaderboard(String roomId) {
        ArenaRoom room = activeRooms.get(roomId);
        if (room == null) return Collections.emptyList();

        List<Participant> sorted = room.getParticipants().values().stream()
                .sorted((a, b) -> Integer.compare(b.score().get(), a.score().get()))
                .toList();

        List<LeaderboardEntry> result = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            Participant p = sorted.get(i);
            result.add(new LeaderboardEntry(
                    i + 1,
                    p.userId(),
                    p.username(),
                    p.score().get(),
                    p.consecutiveStreak().get(),
                    p.trustScore()
            ));
        }
        return result;
    }

    /**
     * Broadcasts live leaderboard update over STOMP topic.
     */
    public void broadcastLeaderboard(String roomId, String eventType) {
        ArenaRoom room = activeRooms.get(roomId);
        if (room == null) return;

        LeaderboardBroadcast broadcast = new LeaderboardBroadcast(
                roomId,
                eventType,
                room.getStatus(),
                getLeaderboard(roomId),
                Instant.now()
        );

        String destination = "/topic/arena/" + roomId + "/leaderboard";
        messagingTemplate.convertAndSend(destination, broadcast);
    }
}
