package com.kabilan.assessment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket and STOMP message broker configuration for real-time multiplayer
 * quiz arenas, live telemetry, and instant leaderboard broadcasting.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // In-memory message broker for subscription destinations
        // Prefix "/topic" for broadcast to all room participants
        // Prefix "/queue" for point-to-point user messages (e.g. anti-cheat warnings)
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for messages originating from clients bound for @MessageMapping handlers
        registry.setApplicationDestinationPrefixes("/app");

        // Destination prefix for targeted individual user communications
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Primary STOMP WebSocket connection endpoint with SockJS fallback
        registry.addEndpoint("/ws-arena")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Plain WebSocket endpoint for high-performance non-SockJS clients
        registry.addEndpoint("/ws-arena-native")
                .setAllowedOriginPatterns("*");
    }
}
