package org.etfbl.backend.controller;

import org.etfbl.backend.dto.PoslovodjaUpravljaProjektom; // Uvezi DTO, ne Entity
import org.etfbl.backend.service.PoslovodjaUpravljaProjektomService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/poslovodja-projekat")
@CrossOrigin(origins="*")
public class PoslovodjaUpravljaProjektomController {

    private final PoslovodjaUpravljaProjektomService poslovodjaUpravljaProjektomService;

    public PoslovodjaUpravljaProjektomController(PoslovodjaUpravljaProjektomService poslovodjaUpravljaProjektomService) {
        this.poslovodjaUpravljaProjektomService = poslovodjaUpravljaProjektomService;
    }

    @GetMapping
    public List<PoslovodjaUpravljaProjektom> getAll() {
        return poslovodjaUpravljaProjektomService.getAllPoslovodjaUpravljaProjektom();
    }
}