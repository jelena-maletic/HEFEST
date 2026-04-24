package org.etfbl.administrator.service;

import jakarta.persistence.EntityNotFoundException;
import org.etfbl.administrator.model.*;
import org.etfbl.administrator.repository.*;
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
    public Korisnik addKorisnik(String jmb, String username, String rawPassword, String email, String ime, String prezime, String brojTelefona, String adminUsername, String tipKorisnika){
        Administrator admin = administratorRepo.findById(adminUsername).orElseThrow(() -> new EntityNotFoundException("Administrator nije pronađen"));

        if(korisnikRepo.existsById(jmb))
            throw new RuntimeException("Korisnik sa ovim JMB-om već postoji");
        String hashedPassword = passwordEncoder.encode(rawPassword);
        Korisnik korisnik;
        switch (tipKorisnika.toLowerCase()) {
            case "direktor":
                korisnik = new Direktor(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
                break;
            case "tehnicar":
                korisnik = new Tehnicar(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
                break;
            case "magacioner":
                korisnik = new Magacioner(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
                break;
            case "knjigovodja":
                korisnik = new Knjigovodja(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
                break;
            case "poslovodja":
                korisnik = new Poslovodja(jmb, username, hashedPassword, email, ime, prezime, brojTelefona);
                break;
            default:
                throw new IllegalArgumentException("Nepoznat tip korisnika: " + tipKorisnika);
        }
        korisnik.setAdministrator(admin);
        return korisnikRepo.save(korisnik);
    }

    @Transactional
    public void deleteKorisnik(String jmb){
        if(!korisnikRepo.existsById(jmb))
            throw new EntityNotFoundException("Traženi korisnik ne postoji");

        korisnikRepo.deleteById(jmb);
    }

    @Transactional
    public Korisnik updateKorisnik(Korisnik updatedKorisnik, String rawPassword){
        Korisnik existingKorisnik = korisnikRepo.findById(updatedKorisnik.getJmb()).orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));

        existingKorisnik.setIme(updatedKorisnik.getIme());
        existingKorisnik.setPrezime(updatedKorisnik.getPrezime());
        existingKorisnik.setUsername(updatedKorisnik.getUsername());
        existingKorisnik.setEmail(updatedKorisnik.getEmail());
        existingKorisnik.setBrojTelefona(updatedKorisnik.getBrojTelefona());

        if(rawPassword != null && !rawPassword.isEmpty()){
            existingKorisnik.setPassword(passwordEncoder.encode(rawPassword));
        }

        return korisnikRepo.save(existingKorisnik);
    }

    public List<Korisnik> getAll(){
        return korisnikRepo.findAll();
    }

    public List<Korisnik> search(String keyword) {
        if(keyword == null || keyword.isBlank())
            return korisnikRepo.findAll();

        return korisnikRepo.findByImeOrPrezimeOrUsernameContainingIgnoreCase(keyword, keyword, keyword);
    }

    public Korisnik getKorisnikByUsername(String username) {
        return korisnikRepo.findByUsername(username).orElse(null);
    }

}
