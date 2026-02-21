package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.service.PoslovodjaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/poslovodje")
@CrossOrigin(origins = "*")
public class PoslovodjaController {
    private final PoslovodjaService poslovodjaService;

    public PoslovodjaController(PoslovodjaService poslovodjaService) {
        this.poslovodjaService = poslovodjaService;
    }

    @GetMapping
    public List<Poslovodja> getAll() {
        return poslovodjaService.getAll();
    }
}
