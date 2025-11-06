package org.etfbl.backend.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.etfbl.backend.model.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class KorisnikDetails implements UserDetails {

    private final Korisnik korisnik;

    public KorisnikDetails(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> roles = new HashSet<>();
        if (korisnik instanceof Direktor) {
            roles.add(new SimpleGrantedAuthority("ROLE_DIREKTOR"));
        } else if (korisnik instanceof Poslovodja) {
            roles.add(new SimpleGrantedAuthority("ROLE_POSLOVODJA"));
        } else if (korisnik instanceof Tehnicar) {
            roles.add(new SimpleGrantedAuthority("ROLE_TEHNICAR"));
        } else if (korisnik instanceof Magacioner) {
            roles.add(new SimpleGrantedAuthority("ROLE_MAGACIONER"));
        } else if (korisnik instanceof Knjigovodja) {
            roles.add(new SimpleGrantedAuthority("ROLE_KNJIGOVODJA"));
        }
        return roles;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    @Override
    public String getPassword() {
        return korisnik.getPassword();
    }

    @Override
    public String getUsername() {
        return korisnik.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

}
