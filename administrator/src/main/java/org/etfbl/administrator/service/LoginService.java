package org.etfbl.administrator.service;

import org.etfbl.administrator.model.Administrator;
import org.etfbl.administrator.repository.AdministratorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private AdministratorRepo administratorRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean login(String korisnickoIme, String lozinka) {
        Optional<Administrator> optionalAdministrator = administratorRepo.findById(korisnickoIme);
        if(optionalAdministrator.isEmpty()) {
            return false;
        }
        Administrator administrator = optionalAdministrator.get();
        return passwordEncoder.matches(lozinka, administrator.getLozinka());
    }


}