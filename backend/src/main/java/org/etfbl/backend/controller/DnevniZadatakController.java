package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniZadatak;
import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.etfbl.backend.service.DnevniZadatakService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dnevni_zadaci")
@CrossOrigin(origins = "*")
public class DnevniZadatakController {
    private final DnevniZadatakService dnevniZadatakService;

    public DnevniZadatakController(DnevniZadatakService dnevniZadatakService) {
        this.dnevniZadatakService = dnevniZadatakService;
    }


    @GetMapping
    public List<DnevniZadatak> getAll() {
        return dnevniZadatakService.getAll();
    }

}
