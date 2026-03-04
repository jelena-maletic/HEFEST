package org.etfbl.administrator.service;

import org.etfbl.administrator.model.Administrator;
import org.etfbl.administrator.repository.AdministratorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private AdministratorRepo administratorRepo;

    private Administrator loggedInAdmin;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean login(String korisnickoIme, String lozinka) {
        Administrator admin = administratorRepo.findById(korisnickoIme).orElse(null);

        if(admin != null && passwordEncoder.matches(lozinka, admin.getLozinka())) {
            loggedInAdmin = admin;
            return true;
        }

        return false;
    }

    public Administrator getAdministrator() {
        return loggedInAdmin;
    }

    public void logout() {
        loggedInAdmin = null;
    }
}