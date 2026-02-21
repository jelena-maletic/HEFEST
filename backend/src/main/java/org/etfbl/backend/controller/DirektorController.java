package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.service.DirektorService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/direktori")
@CrossOrigin(origins = "*")
public class DirektorController {
    private final DirektorService direktorService;

    public DirektorController(DirektorService direktorService) {
        this.direktorService = direktorService;
    }

    @GetMapping
    public List<Direktor> getAll() {
        return direktorService.getAll();
    }
}
