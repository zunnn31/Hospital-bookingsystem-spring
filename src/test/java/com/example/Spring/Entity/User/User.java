package com.example.Spring.Entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String phone;

    private String role = "PATIENT";

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    public enum BloodGroup {
        A_POS, A_NEG, B_POS, B_NEG, O_POS, O_NEG, AB_POS, AB_NEG;

        @JsonCreator
        public static BloodGroup fromValue(String value) {
            return switch (value) {
                case "A+" -> A_POS;
                case "A-" -> A_NEG;
                case "B+" -> B_POS;
                case "B-" -> B_NEG;
                case "O+" -> O_POS;
                case "O-" -> O_NEG;
                case "AB+" -> AB_POS;
                case "AB-" -> AB_NEG;
                default -> valueOf(value);
            };
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }
}