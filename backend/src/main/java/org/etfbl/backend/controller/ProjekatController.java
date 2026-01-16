package org.etfbl.backend.controller;

import org.etfbl.backend.model.Projekat;
import org.etfbl.backend.service.ProjekatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<Projekat> kreirajProjekat(@RequestBody Projekat projekat) {
        Projekat noviProjekat = projekatService.sacuvajProjekat(projekat);
        return new ResponseEntity<>(noviProjekat, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projekat> getById(@PathVariable Integer id) {
        Projekat projekat = projekatService.getProjekatById(id);
        return ResponseEntity.ok(projekat);
    }
}
