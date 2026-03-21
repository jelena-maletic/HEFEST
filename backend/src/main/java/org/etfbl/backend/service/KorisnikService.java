package org.etfbl.backend.service;


import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.PromjenaLozinkeRequest;
import org.etfbl.backend.model.KorisnikEntity;
import org.etfbl.backend.repository.KorisnikRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class KorisnikService {
   
    private KorisnikRepository korisnikRepository;
    private final ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public KorisnikService(KorisnikRepository korisnikRepository, ModelMapper modelMapper) {
        this.korisnikRepository = korisnikRepository;
        this.modelMapper = modelMapper;
    }


    public String getImeIPrezimeByJmb(String jmb) {
        return korisnikRepository.findById(jmb)
                .map(k -> k.getIme() + " " + k.getPrezime())
                .orElse("Nepoznat korisnik");
    }

    public void changePassword(PromjenaLozinkeRequest request) {
        String principalName = getLoggedUserJmb();
        System.out.println("Pokušavam pronaći korisnika sa username/JMB: " + principalName);

        KorisnikEntity korisnik = korisnikRepository.findByUsername(principalName)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen za identifikator: " + principalName));


        if (!passwordEncoder.matches(request.getOldPassword(), korisnik.getPassword())) {
            throw new RuntimeException("Pogrešna trenutna lozinka");
        }

        String hashed = passwordEncoder.encode(request.getNewPassword());

        korisnik.setPassword(hashed);
        korisnikRepository.save(korisnik);
    }

    public String getLoggedUserJmb() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return null;
    }
}
