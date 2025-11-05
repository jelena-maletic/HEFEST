package org.etfbl.backend.controller;

import org.etfbl.backend.model.Projekat;
import org.etfbl.backend.service.ProjekatService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projekti")
@CrossOrigin(origins = "*")
public class ProjekatController {
    private final ProjekatService projekatService;

    public ProjekatController(ProjekatService projekatService) {
        this.projekatService = projekatService;
    }

    @GetMapping
    public List<Projekat> getAllProjekti() {
        return projekatService.getAllProjekti();
    }
}
