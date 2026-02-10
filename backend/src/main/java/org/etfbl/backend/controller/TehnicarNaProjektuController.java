package org.etfbl.backend.controller;

import org.etfbl.backend.dto.TehnicarNaProjektu;
import org.etfbl.backend.service.TehnicarNaProjektuService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/tehnicar_projekat")
@CrossOrigin(origins="*")
public class TehnicarNaProjektuController {
    private final TehnicarNaProjektuService service;

    public TehnicarNaProjektuController(TehnicarNaProjektuService service) {
        this.service = service;
    }

    @GetMapping
    public List<TehnicarNaProjektu> getAll() {return service.getAllTehnicarNaProjektu();}
}
