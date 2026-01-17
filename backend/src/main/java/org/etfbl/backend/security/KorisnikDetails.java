package org.etfbl.backend.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.etfbl.backend.model.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class KorisnikDetails implements UserDetails {

    private final KorisnikEntity korisnikEntity;

    public KorisnikDetails(KorisnikEntity korisnikEntity) {
        this.korisnikEntity = korisnikEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> roles = new HashSet<>();
        if (korisnikEntity instanceof DirektorEntity) {
            roles.add(new SimpleGrantedAuthority("ROLE_DIREKTOR"));
        } else if (korisnikEntity instanceof PoslovodjaEntity) {
            roles.add(new SimpleGrantedAuthority("ROLE_POSLOVODJA"));
        } else if (korisnikEntity instanceof TehnicarEntity) {
            roles.add(new SimpleGrantedAuthority("ROLE_TEHNICAR"));
        } else if (korisnikEntity instanceof MagacionerEntity) {
            roles.add(new SimpleGrantedAuthority("ROLE_MAGACIONER"));
        } else if (korisnikEntity instanceof KnjigovodjaEntity) {
            roles.add(new SimpleGrantedAuthority("ROLE_KNJIGOVODJA"));
        }
        return roles;
    }

    public KorisnikEntity getKorisnik() {
        return korisnikEntity;
    }


    @Override
    public String getPassword() {
        return korisnikEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return korisnikEntity.getUsername();
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
