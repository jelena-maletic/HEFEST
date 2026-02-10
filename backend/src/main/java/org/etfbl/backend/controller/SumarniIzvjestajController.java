package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.service.SumarniIzvjestajService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sumarni_izvjestaji")
@CrossOrigin(origins = "*")
public class SumarniIzvjestajController {
    private final SumarniIzvjestajService sumarniIzvjestajService;

    public SumarniIzvjestajController(SumarniIzvjestajService sumarniIzvjestajService) {
        this.sumarniIzvjestajService = sumarniIzvjestajService;
    }

    @GetMapping
    public List<SumarniIzvjestaj> findAll() {
        return sumarniIzvjestajService.getAll();
    }
}
