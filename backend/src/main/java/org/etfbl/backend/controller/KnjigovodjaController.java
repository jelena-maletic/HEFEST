package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Knjigovodja;
import org.etfbl.backend.service.KnjigovodjaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/knjigovodje")
@CrossOrigin(origins = "*")
public class KnjigovodjaController {
    private final KnjigovodjaService knjigovodjaService;

    public KnjigovodjaController(KnjigovodjaService knjigovodjaService) {
        this.knjigovodjaService = knjigovodjaService;
    }

    @GetMapping
    public List<Knjigovodja> getAll() {
        return knjigovodjaService.getAll();
    }
}
