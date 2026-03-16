package org.etfbl.backend.service;


import jakarta.transaction.Transactional;
import org.etfbl.backend.repository.KorisnikRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class KorisnikService {
   
    private KorisnikRepository korisnikRepository;
    private final ModelMapper modelMapper;

    public KorisnikService(KorisnikRepository korisnikRepository, ModelMapper modelMapper) {
        this.korisnikRepository = korisnikRepository;
        this.modelMapper = modelMapper;
    }


    public String getImeIPrezimeByJmb(String jmb) {
        return korisnikRepository.findById(jmb)
                .map(k -> k.getIme() + " " + k.getPrezime())
                .orElse("Nepoznat korisnik");
    }
}
