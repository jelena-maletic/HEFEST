package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.dto.Zaposleni;
import org.etfbl.backend.service.ZaposleniService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/zaposleni")
@CrossOrigin(origins = "*")
public class ZaposleniController {
    private final ZaposleniService zaposleniService;

    public ZaposleniController(ZaposleniService zaposleniService) {
        this.zaposleniService = zaposleniService;
    }

    @GetMapping
    public List<Zaposleni> getAll() {
        return zaposleniService.getAll();
    }
}
