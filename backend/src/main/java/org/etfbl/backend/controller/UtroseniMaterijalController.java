package org.etfbl.backend.controller;

import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.service.UtroseniMaterijalService;
import org.etfbl.backend.service.VoziloService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/utroseni_materijali")
@CrossOrigin(origins = "*")
public class UtroseniMaterijalController {

    private final UtroseniMaterijalService utroseniMaterijalService;

    public UtroseniMaterijalController(UtroseniMaterijalService utroseniMaterijalService) {
        this.utroseniMaterijalService = utroseniMaterijalService;
    }

    @GetMapping
        public List<UtroseniMaterijal> getAll() {
            return utroseniMaterijalService.getAllUtroseniMaterijal();
        }

}
