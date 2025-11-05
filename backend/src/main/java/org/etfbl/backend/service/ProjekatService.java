package org.etfbl.backend.service;

import org.etfbl.backend.model.Projekat;
import org.etfbl.backend.repository.ProjekatRepository;
import org.springframework.stereotype.Service;

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
}
