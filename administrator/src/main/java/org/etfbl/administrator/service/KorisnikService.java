package org.etfbl.administrator.service;

import jakarta.persistence.EntityNotFoundException;
import org.etfbl.administrator.model.Korisnik;
import org.etfbl.administrator.model.Administrator;
import org.etfbl.administrator.repository.KorisnikRepo;
import org.etfbl.administrator.repository.AdministratorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KorisnikService {
    @Autowired
    private KorisnikRepo korisnikRepo;

    @Autowired
    private AdministratorRepo administratorRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public Korisnik addKorisnik(String jmb, String username, String rawPassword, String email, String ime, String prezime, String brojTelefona, String adminUsername){
        Administrator admin = administratorRepo.findById(adminUsername).orElseThrow(() -> new EntityNotFoundException("Administrator nije pronađen"));

        if(korisnikRepo.existsById(jmb))
            throw new RuntimeException("Korisnik sa ovim JMB-om već postoji");

        String hashedPassword = passwordEncoder.encode(rawPassword);
        Korisnik k = new Korisnik(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
        k.setAdministrator(admin);

        return korisnikRepo.save(k);
    }

    @Transactional
    public void deleteKorisnik(String jmb){
        korisnikRepo.deleteById(jmb);
    }

    @Transactional
    public Korisnik updateKorisnik(Korisnik k, String rawPassword){
        if(rawPassword != null && !rawPassword.isEmpty()){
            k.setPassword(passwordEncoder.encode(rawPassword));
        }

        return korisnikRepo.save(k);
    }

    public List<Korisnik> getAll(){
        return korisnikRepo.findAll();
    }
}
