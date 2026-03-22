package org.etfbl.backend.controller;


import org.etfbl.backend.dto.ResursUZahtjevu;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.dto.Zaduzenje;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.repository.ZaduzenjeRepository;
import org.etfbl.backend.service.ZaduzenjeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/zaduzenja")
public class ZaduzenjeController {
    private final ZaduzenjeService zaduzenjeService;

    public ZaduzenjeController(ZaduzenjeService zaduzenjeService) {
        this.zaduzenjeService = zaduzenjeService;
    }

    @GetMapping
    public List<Zaduzenje> getAll() {
        return zaduzenjeService.getAllZaduzenje();
    }

    @PostMapping
    public ResponseEntity<Zaduzenje> kreirajZaduzenje(@RequestBody Zaduzenje dto) {
        Zaduzenje novo = zaduzenjeService.sacuvajZaduzenje(dto);
        return new ResponseEntity<>(novo, HttpStatus.CREATED);
    }

    @DeleteMapping("/{jmb}/{resursId}")
    public ResponseEntity<Void> obrisiZaduzenje(@PathVariable String jmb, @PathVariable Integer resursId) {
        zaduzenjeService.obrisiZaduzenje(jmb, resursId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{jmb}/{resursId}")
    public ResponseEntity<Zaduzenje> azurirajZaduzenje(
            @PathVariable String jmb,
            @PathVariable Integer resursId,
            @RequestBody Zaduzenje dto) throws NotFoundException {
        Zaduzenje azurirano = zaduzenjeService.updateZaduzenje(jmb, resursId, dto);
        return ResponseEntity.ok(azurirano);
    }
}
