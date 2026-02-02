package org.etfbl.backend.controller;


import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.service.MaterijalService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/materijal")
@CrossOrigin(origins = "*")
public class MaterijalController {

    private final MaterijalService materijalService;

    public MaterijalController(MaterijalService materijalService) {
        this.materijalService = materijalService;
    }

    @GetMapping
    public List<Materijal> findAll() {
        return materijalService.getAll();
    }
}
