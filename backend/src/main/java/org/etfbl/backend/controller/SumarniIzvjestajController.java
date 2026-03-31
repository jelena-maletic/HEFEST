package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.service.SumarniIzvjestajService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sumarni_izvjestaji")
@CrossOrigin(origins = "*")
public class SumarniIzvjestajController {
    private final SumarniIzvjestajService sumarniIzvjestajService;

    public SumarniIzvjestajController(SumarniIzvjestajService sumarniIzvjestajService) {
        this.sumarniIzvjestajService = sumarniIzvjestajService;
    }

    @GetMapping
    public List<SumarniIzvjestaj> findAll() {
        return sumarniIzvjestajService.getAll();
    }

    @GetMapping("/{id}")
    public SumarniIzvjestaj getOne(@PathVariable Integer id) {
        return sumarniIzvjestajService.getById(id);
    }

    @PostMapping
    public SumarniIzvjestaj create(@RequestBody SumarniIzvjestaj dto) {
        return sumarniIzvjestajService.create(dto);
    }

    @PutMapping("/{id}")
    public SumarniIzvjestaj update(@PathVariable Integer id, @RequestBody SumarniIzvjestaj dto) {
        return sumarniIzvjestajService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        sumarniIzvjestajService.delete(id);
    }
}
