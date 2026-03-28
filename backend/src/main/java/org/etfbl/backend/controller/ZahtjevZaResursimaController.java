package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniZadatak;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.Zaduzenje;
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

    @GetMapping
    public List<ZahtjevZaResursima> getAll() {return zahtjevZaResursimaService.getAllZahtjevi();}

    @PostMapping
    public ResponseEntity<ZahtjevZaResursima> kreirajZahtjev(@RequestBody ZahtjevZaResursima z) {
        ZahtjevZaResursima noviZahtjev = zahtjevZaResursimaService.sacuvajZahtjev(z);
        return new ResponseEntity<>(noviZahtjev, HttpStatus.CREATED);
    }

    @GetMapping("/{poslovodjaJMB}")
    public ResponseEntity<List<ZahtjevZaResursima>> getAllByPoslovodjaJMB(@PathVariable String poslovodjaJMB) throws NotFoundException {
        List<ZahtjevZaResursima> r=zahtjevZaResursimaService.getZahtjeviByPoslovodjaId(poslovodjaJMB);
        return ResponseEntity.ok(r);
    }

    @PatchMapping("/{id}/stanjeZahtjeva")
    public ResponseEntity<ZahtjevZaResursima> updateStanje(
            @PathVariable Integer id,
            @RequestParam StanjeZahtjeva stanjeZahtjeva){
        return ResponseEntity.ok(zahtjevZaResursimaService.updateStanje(id, stanjeZahtjeva));
    }

}
