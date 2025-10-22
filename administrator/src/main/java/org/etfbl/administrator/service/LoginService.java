package org.etfbl.administrator.service;

import com.example.demo.model.Administrator;
import com.example.demo.repository.AdministratorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private AdministratorRepo administratorRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean login(String korisnickoIme, String lozinka) {
        Optional<Administrator> optionalAdministrator = administratorRepo.findById(korisnickoIme);
        if(optionalAdministrator.isEmpty) {
            return false;
        }
        Administrator administrator = optionalAdministrator.get();
        return passwordEncoder.matches(lozinka, administrator.getLozinka());
    }


}