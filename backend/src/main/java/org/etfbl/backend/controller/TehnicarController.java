package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.service.TehnicarService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tehnicari")
@CrossOrigin(origins = "*")
public class TehnicarController {
    private final TehnicarService tehnicarService;

    public TehnicarController(TehnicarService tehnicarService) {
        this.tehnicarService = tehnicarService;
    }

    @GetMapping
    public List<Tehnicar> getAll() {
        return tehnicarService.getAll();
    }
}
