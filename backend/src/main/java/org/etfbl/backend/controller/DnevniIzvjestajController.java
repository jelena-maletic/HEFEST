package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dnevni_izvjestaji")
@CrossOrigin(origins = "*")
public class DnevniIzvjestajController {
    private final DnevniIzvjestajService dnevniIzvjestajService;

    public DnevniIzvjestajController(DnevniIzvjestajService dnevniIzvjestajService) {
        this.dnevniIzvjestajService = dnevniIzvjestajService;
    }

    @GetMapping
    public List<DnevniIzvjestaj> findAll() {return dnevniIzvjestajService.getAll();}

    // Putanja: GET /api/dnevni_izvjestaji/projekat/1?od=2026-01-01&do=2026-01-31
    @GetMapping("/projekat/{idProjekta}")
    public List<DnevniIzvjestaj> getPoProjektuIPeriodu(
            @PathVariable Integer idProjekta,
            @RequestParam("od") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam("do") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate doDatuma) {

        return dnevniIzvjestajService.getIzvjestajiZaProjekatUPeriodu(idProjekta, od, doDatuma);
    }

    @GetMapping("/{id}")
    public DnevniIzvjestaj getOne(@PathVariable Integer id) {
        return dnevniIzvjestajService.getById(id);
    }

    @PostMapping
    public DnevniIzvjestaj create(@RequestBody DnevniIzvjestaj dto) {
        return dnevniIzvjestajService.create(dto);
    }

    @PutMapping("/{id}")
    public DnevniIzvjestaj update(@PathVariable Integer id, @RequestBody DnevniIzvjestaj dto) {
        return dnevniIzvjestajService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        dnevniIzvjestajService.delete(id);
    }
}
