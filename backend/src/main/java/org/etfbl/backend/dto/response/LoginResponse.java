package org.etfbl.backend.dto.response;

public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String  jmb;

    public LoginResponse(String token, String username, String role, String jmbg) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.jmb = jmbg;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
    public String getJmb() {return jmb;}
}
