package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniZadatak;
import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.model.DnevniZadatakRequest;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.etfbl.backend.service.DnevniZadatakService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dnevni_zadaci")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
public class DnevniZadatakController {
    private final DnevniZadatakService dnevniZadatakService;

    public DnevniZadatakController(DnevniZadatakService dnevniZadatakService) {
        this.dnevniZadatakService = dnevniZadatakService;
    }

    @GetMapping
    public List<DnevniZadatak> getAll() {
        return dnevniZadatakService.getAll();
    }

    @PostMapping
    public ResponseEntity<DnevniZadatak> create(@RequestBody DnevniZadatakRequest request) {
        return ResponseEntity.ok(dnevniZadatakService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        dnevniZadatakService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DnevniZadatak> updateStatus(
            @PathVariable Integer id,
            @RequestParam Boolean zavrsen) {
        return ResponseEntity.ok(dnevniZadatakService.updateStatus(id, zavrsen));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DnevniZadatak> update(
            @PathVariable Integer id,
            @RequestBody DnevniZadatakRequest request) {
        return ResponseEntity.ok(dnevniZadatakService.updateZadatak(id, request));
    }
}
