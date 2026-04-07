package org.etfbl.backend.controller;

import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.service.UtroseniMaterijalService;
import org.etfbl.backend.service.VoziloService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public UtroseniMaterijal getOne(@PathVariable Integer id) {
        return utroseniMaterijalService.getById(id);
    }

    @PostMapping
    public UtroseniMaterijal create(@RequestBody UtroseniMaterijal dto) {
        return utroseniMaterijalService.create(dto);
    }

    @PutMapping("/{id}")
    public UtroseniMaterijal update(@PathVariable Integer id, @RequestBody UtroseniMaterijal dto) {
        return utroseniMaterijalService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        utroseniMaterijalService.delete(id);
    }
}
