package org.etfbl.backend.security;

import org.etfbl.backend.model.KorisnikEntity;
import org.etfbl.backend.repository.KorisnikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class KorisnikDetailsService implements UserDetailsService {

    @Autowired
    private KorisnikRepository korisnikRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        KorisnikEntity korisnikEntity = korisnikRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("KorisnikEntity not found"));
        return new KorisnikDetails(korisnikEntity);
    }
}