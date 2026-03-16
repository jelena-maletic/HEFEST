package org.etfbl.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private KorisnikDetailsService korisnikDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login/**").permitAll() // login endpoint
                        .requestMatchers("/api/projekti/**").permitAll()
                        .requestMatchers("/api/magacioner-resurs/**").permitAll()
                        .requestMatchers("/api/vozila/**").permitAll()
                        .requestMatchers("/api/radna-oprema/**").permitAll()
                        .requestMatchers("/api/materijal/**").permitAll()
                        .requestMatchers("/api/zahtjevi/**").permitAll()
                        .requestMatchers("/api/resursi-u-zahtjevu/**").permitAll()
                        .requestMatchers("/api/zaduzenja/**").permitAll()
                        .requestMatchers("/api/poslovodja-projekat/**").permitAll()
                        .requestMatchers("/api/sumarni_izvjestaji/**").permitAll()
                        .requestMatchers("/api/dnevni_izvjestaji/**").permitAll()
                        .requestMatchers("/api/utroseni_materijali/**").permitAll()
                        .requestMatchers("/api/dnevni_zadaci/**").permitAll()
                        .requestMatchers("/api/tehnicar_projekat/**").permitAll()
                        .requestMatchers("/api/direktor_izvjestaj/**").permitAll()
                        .requestMatchers("/api/direktori/**").permitAll()
                        .requestMatchers("/api/knjigovodje/**").permitAll()
                        .requestMatchers("/api/magacioneri/**").permitAll()
                        .requestMatchers("/api/poslovodje/**").permitAll()
                        .requestMatchers("/api/tehnicari/**").permitAll()
                        .requestMatchers("/api/zaposleni/**").permitAll()
                        .requestMatchers("/api/resursi/**").permitAll()
                        .requestMatchers("/api/korisnici/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}