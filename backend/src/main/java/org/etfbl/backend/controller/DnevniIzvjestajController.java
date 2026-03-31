package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.springframework.web.bind.annotation.*;

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
