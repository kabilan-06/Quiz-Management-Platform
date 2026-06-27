package com.examly.springapp.dto;

public class UserDTO {
    private Long id;
    private String name;
    private String role;
    private Long mentorId;

    public UserDTO(Long id, String name, String role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public UserDTO(Long id, String name, String role, Long mentorId) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.mentorId = mentorId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }
}
