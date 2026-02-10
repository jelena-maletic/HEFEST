package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DirektorPregledaIzvjestaj;
import org.etfbl.backend.service.DirektorPregledaIzvjestajService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/direktor_izvjestaj")
@CrossOrigin(origins="*")
public class DirektorPregledaIzvjestajController {

    private final DirektorPregledaIzvjestajService service;

    public DirektorPregledaIzvjestajController(DirektorPregledaIzvjestajService service) {
        this.service = service;
    }

    @GetMapping
    public List<DirektorPregledaIzvjestaj> getAll() {
        return service.getAllDirektorPregledaIzvjestaj();
    }
}
