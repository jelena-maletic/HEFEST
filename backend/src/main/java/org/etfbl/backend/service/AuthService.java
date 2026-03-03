package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.request.LoginRequest;
import org.etfbl.backend.dto.response.LoginResponse;
import org.etfbl.backend.security.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.etfbl.backend.security.KorisnikDetails;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtToken jwtToken;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtToken jwtToken) {
        this.authenticationManager = authenticationManager;
        this.jwtToken = jwtToken;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        KorisnikDetails userDetails = (KorisnikDetails) authentication.getPrincipal();
        String token = jwtToken.generateToken(userDetails);

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElseThrow(() -> new IllegalStateException("User has no assigned role"));

        return new LoginResponse(token, userDetails.getUsername(), role);
    }
}