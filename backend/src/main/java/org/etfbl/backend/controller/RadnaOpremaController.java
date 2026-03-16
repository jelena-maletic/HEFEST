package org.etfbl.backend.controller;

import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.RadnaOpremaEntity;
import org.etfbl.backend.service.RadnaOpremaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/radna-oprema")
@CrossOrigin(origins = "*")
public class RadnaOpremaController {
    private final RadnaOpremaService radnaOpremaService;

    public RadnaOpremaController(RadnaOpremaService r) {
        this.radnaOpremaService = r;
    }

    @GetMapping
    public List<RadnaOprema> getAll() {
        return radnaOpremaService.getAllRadnaOprema();
    }

    @PostMapping
    public ResponseEntity<RadnaOprema> kreirajRadnuOpremu(@RequestBody RadnaOprema ro) {
        RadnaOprema novaRO = radnaOpremaService.sacuvajRadnuOpremu(ro);
        return new ResponseEntity<>(novaRO, HttpStatus.CREATED);
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> obrisiRadnuOpremu(@PathVariable Integer id) {
        this.radnaOpremaService.obrisiRadnuOpremu(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RadnaOprema> azurirajRadnuOpremu(@PathVariable Integer id, @RequestBody RadnaOprema radnaOprema) {
        radnaOprema.setId(id);
        RadnaOprema azuriranaRadnaOprema = this.radnaOpremaService.updateRadnaOprema(radnaOprema);
        return new ResponseEntity<>(azuriranaRadnaOprema, HttpStatus.ACCEPTED);
    }

    @GetMapping({"/{id}"})
    public ResponseEntity<RadnaOprema> getById(@PathVariable Integer id) {
        RadnaOprema ro = this.radnaOpremaService.getRadnaOpremaById(id);
        return ResponseEntity.ok(ro);
    }
}
