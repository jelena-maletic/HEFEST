package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dnevni_izvjestaji")
@CrossOrigin(origins = "*")
public class DnevniIzvjestajController {
    private final DnevniIzvjestajService dnevniIzvjestajService;

    public DnevniIzvjestajController(DnevniIzvjestajService dnevniIzvjestajService) {
        this.dnevniIzvjestajService = dnevniIzvjestajService;
    }

    @GetMapping
    public List<DnevniIzvjestaj> findAll() {return dnevniIzvjestajService.getAll();}
}
