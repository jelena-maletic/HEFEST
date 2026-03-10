package org.etfbl.backend.controller;

import java.util.List;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.service.VoziloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/vozila"})
@CrossOrigin(origins = {"*"})
public class VoziloController {
    private final VoziloService voziloService;

    public VoziloController(VoziloService voziloService) {
        this.voziloService = voziloService;
    }

    // Dohvatanje svih vozila
    @GetMapping
    public List<Vozilo> getAll() {
        return this.voziloService.getAllVozilo();
    }

    // OVO TI JE FALILO: Kreiranje novog vozila
    @PostMapping
    public ResponseEntity<Vozilo> kreirajVozilo(@RequestBody Vozilo vozilo) {
        Vozilo novoVozilo = voziloService.sacuvajVozilo(vozilo);
        return new ResponseEntity<>(novoVozilo, HttpStatus.CREATED);
    }

    // Opciono: Ako treba da brišeš vozila
    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> obrisiVozilo(@PathVariable Integer id) {
        this.voziloService.obrisiVozilo(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vozilo> azurirajVozilo(@PathVariable Long id, @RequestBody Vozilo vozilo) {
        vozilo.setId(id.toString());

        Vozilo azuriranoVozilo = this.voziloService.updateVozilo(vozilo);
        return new ResponseEntity<>(azuriranoVozilo, HttpStatus.ACCEPTED);
    }

    // Opciono: Ako treba da dohvatiš vozilo po ID-u
    @GetMapping({"/{id}"})
    public ResponseEntity<Vozilo> getById(@PathVariable Integer id) {
        Vozilo vozilo = this.voziloService.getVoziloById(id);
        return ResponseEntity.ok(vozilo);
    }
}