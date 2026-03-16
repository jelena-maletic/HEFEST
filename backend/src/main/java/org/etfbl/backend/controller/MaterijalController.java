package org.etfbl.backend.controller;


import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.service.MaterijalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materijal")
@CrossOrigin(origins = "*")
public class MaterijalController {

    private final MaterijalService materijalService;

    public MaterijalController(MaterijalService materijalService) {
        this.materijalService = materijalService;
    }

    @GetMapping
    public List<Materijal> findAll() {
        return materijalService.getAll();
    }

    @PostMapping
    public ResponseEntity<Materijal> kreirajaterijal(@RequestBody Materijal materijal) {
        Materijal noviMaterijal = materijalService.sacuvajMaterijal(materijal);
        return new ResponseEntity<>(noviMaterijal, HttpStatus.CREATED);
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> obrisiMaterijal(@PathVariable Integer id) {
        this.materijalService.obrisiMaterijal(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Materijal> azurirajMaterijal(@PathVariable Long id, @RequestBody Materijal materijal) {
        materijal.setId(id.toString());

        Materijal azuriraniMaterijal = this.materijalService.updateMaterijal(materijal);
        return new ResponseEntity<>(azuriraniMaterijal, HttpStatus.ACCEPTED);
    }

    @GetMapping({"/{id}"})
    public ResponseEntity<Materijal> getById(@PathVariable Integer id) {
        Materijal materijal = this.materijalService.getMaterijalById(id);
        return ResponseEntity.ok(materijal);
    }
}
