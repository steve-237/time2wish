package com.time2wish.time2wish_api.dto;

public class ResetPasswordRequestDTO {
    private String token;
    private String newPassword;

    // Getters et Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
