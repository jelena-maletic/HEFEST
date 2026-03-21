package org.etfbl.backend.dto;

import lombok.Data;

@Data
public class PromjenaLozinkeRequest {
    private String oldPassword;
    private String newPassword;
}
