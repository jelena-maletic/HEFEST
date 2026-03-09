package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.Resurs;
import org.etfbl.backend.repository.ResursRepository;
import org.etfbl.backend.service.ResursService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resursi")
@CrossOrigin(origins = "*")
public class ResursController {

    private final ResursService resursService;

    public ResursController(ResursService resursService) {
        this.resursService = resursService;
    }

    @GetMapping
    public List<Resurs> getAllResursi() {
        return resursService.getAllResursi();
    }

    @PostMapping
    public ResponseEntity<Resurs> kreirajResurs(@RequestBody Resurs resursEntity) {
        Resurs noviResursEntity = resursService.sacuvajResurs(resursEntity);
        return new ResponseEntity<>(noviResursEntity, HttpStatus.CREATED);
    }
}
