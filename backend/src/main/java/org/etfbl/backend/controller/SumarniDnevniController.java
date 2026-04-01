package org.etfbl.backend.controller;

import org.etfbl.backend.dto.SumarniDnevni;
import org.etfbl.backend.service.SumarniDnevniService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sumarni-dnevni")
@CrossOrigin(origins = "*")
public class SumarniDnevniController {

    private final SumarniDnevniService service;

    public SumarniDnevniController(SumarniDnevniService service) {
        this.service = service;
    }

    @GetMapping
    public List<SumarniDnevni> getAll() {
        return service.getAll();
    }

    @GetMapping("/sumarni/{id}")
    public List<SumarniDnevni> getBySumarni(@PathVariable Integer id) {
        return service.getBySumarniId(id);
    }

    @PostMapping
    public SumarniDnevni create(@RequestBody SumarniDnevni dto) {
        return service.create(dto);
    }

    @DeleteMapping("/{idSumarni}/{idDnevni}")
    public ResponseEntity<Void> delete(@PathVariable Integer idSumarni, @PathVariable Integer idDnevni) {
        service.delete(idSumarni, idDnevni);
        return ResponseEntity.noContent().build();
    }
}
