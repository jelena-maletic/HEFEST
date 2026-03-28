package org.etfbl.backend.controller;

import org.etfbl.backend.dto.ZahtjevZaResursima;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.StanjeZahtjeva;
import org.etfbl.backend.service.ZahtjevZaResursimaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zahtjevi")
@CrossOrigin(origins = "*")
public class ZahtjevZaResursimaController {

    private final ZahtjevZaResursimaService zahtjevZaResursimaService;

    public ZahtjevZaResursimaController(ZahtjevZaResursimaService zahtjevZaResursimaService) {
        this.zahtjevZaResursimaService = zahtjevZaResursimaService;
    }

    // 1. Dobavljanje svih zahtjeva (GET /api/zahtjevi)
    @GetMapping
    public List<ZahtjevZaResursima> getAll() {
        return zahtjevZaResursimaService.getAllZahtjevi();
    }

    // 2. Dobavljanje JEDNOG zahtjeva po ID-u (GET /api/zahtjevi/1)
    @GetMapping("/{id}")
    public ResponseEntity<ZahtjevZaResursima> getById(@PathVariable Integer id) throws NotFoundException {
        // Ova metoda u servisu mora da postoji (vidi dopunu ispod)
        ZahtjevZaResursima zahtjev = zahtjevZaResursimaService.getZahtjevById(id);
        return ResponseEntity.ok(zahtjev);
    }

    // 3. Dobavljanje zahtjeva po JMB-u poslovođe (GET /api/zahtjevi/poslovodja/123...)
    @GetMapping("/poslovodja/{poslovodjaJMB}")
    public ResponseEntity<List<ZahtjevZaResursima>> getAllByPoslovodjaJMB(@PathVariable String poslovodjaJMB) throws NotFoundException {
        List<ZahtjevZaResursima> r = zahtjevZaResursimaService.getZahtjeviByPoslovodjaId(poslovodjaJMB);
        return ResponseEntity.ok(r);
    }

    // 4. Kreiranje novog zahtjeva (POST /api/zahtjevi)
    @PostMapping
    public ResponseEntity<ZahtjevZaResursima> kreirajZahtjev(@RequestBody ZahtjevZaResursima z) {
        ZahtjevZaResursima noviZahtjev = zahtjevZaResursimaService.sacuvajZahtjev(z);
        return new ResponseEntity<>(noviZahtjev, HttpStatus.CREATED);
    }

    // 5. Update stanja (PATCH /api/zahtjevi/1/stanjeZahtjeva?stanjeZahtjeva=odobren)
    @PatchMapping("/{id}/stanjeZahtjeva")
    public ResponseEntity<ZahtjevZaResursima> updateStanje(
            @PathVariable Integer id,
            @RequestParam StanjeZahtjeva stanjeZahtjeva) {
        return ResponseEntity.ok(zahtjevZaResursimaService.updateStanje(id, stanjeZahtjeva));
    }

    // 6. Brisanje zahtjeva (DELETE /api/zahtjevi/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> obrisi(@PathVariable Integer id) {
        zahtjevZaResursimaService.obrisiZahtjev(id);
        return ResponseEntity.noContent().build();
    }

    // 7. Kompletan update (PUT /api/zahtjevi/1)
    @PutMapping("/{id}")
    public ResponseEntity<ZahtjevZaResursima> azuriraj(@PathVariable Integer id, @RequestBody ZahtjevZaResursima dto) throws NotFoundException {
        return ResponseEntity.ok(zahtjevZaResursimaService.updateZahtjev(id, dto));
    }
}