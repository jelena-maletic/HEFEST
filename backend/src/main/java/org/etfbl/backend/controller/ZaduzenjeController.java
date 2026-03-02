package org.etfbl.backend.controller;


import org.etfbl.backend.dto.ResursUZahtjevu;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.dto.Zaduzenje;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.repository.ZaduzenjeRepository;
import org.etfbl.backend.service.ZaduzenjeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zaduzenja")
@CrossOrigin(origins = "*")
public class ZaduzenjeController {
    private final ZaduzenjeService zaduzenjeService;

    public ZaduzenjeController( ZaduzenjeService zaduzenjeService) {
        this.zaduzenjeService = zaduzenjeService;

    }
    @GetMapping("/{poslovodjaJMB}")
    public ResponseEntity<List<Zaduzenje>> getAllByPoslovodjaJMB(@PathVariable String poslovodjaJMB) throws NotFoundException {
        List<Zaduzenje> r=zaduzenjeService.getZaduzenjaByPoslovodjaId(poslovodjaJMB);
        return ResponseEntity.ok(r);
    }

    @GetMapping
    public List<Zaduzenje> getAll() {
        return zaduzenjeService.getAllZaduzenje();
    }

}
