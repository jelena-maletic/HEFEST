package org.etfbl.backend.controller;


import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.service.VoziloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vozila")
@CrossOrigin(origins = "*")
public class VoziloController {

    private final VoziloService voziloService;

    public VoziloController(VoziloService voziloService) {
        this.voziloService = voziloService;
    }
    @GetMapping
    public List<Vozilo> getAll() {
        return voziloService.getAllVozilo();
    }
}
