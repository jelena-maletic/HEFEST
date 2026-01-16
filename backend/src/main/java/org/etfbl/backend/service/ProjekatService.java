package org.etfbl.backend.service;

import org.etfbl.backend.model.Projekat;
import org.etfbl.backend.repository.ProjekatRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ProjekatService {
    private final ProjekatRepository projekatRepository;

    public ProjekatService(ProjekatRepository projekatRepository) {
        this.projekatRepository = projekatRepository;
    }

    public List<Projekat> getAllProjekti() {
        return projekatRepository.findAll();
    }

    public Projekat sacuvajProjekat(Projekat projekat) {
        // Automatsko postavljanje vremenskih oznaka
        Instant sada = Instant.now();
        projekat.setDatumKreiranja(sada);
        projekat.setPosljednjaIzmjena(sada);


        return projekatRepository.save(projekat);
    }

    public Projekat getProjekatById(Integer id) {
        return projekatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projekat sa ID " + id + " nije pronadjen."));
    }
}
