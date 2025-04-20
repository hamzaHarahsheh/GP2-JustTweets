package com.Jitter.Jitter.Backend.DTO;

import lombok.Data;

@Data
public class LoginResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer ";

    public LoginResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
}
