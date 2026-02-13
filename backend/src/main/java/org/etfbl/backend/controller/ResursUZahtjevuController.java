package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.ResursUZahtjevu;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.service.ResursUZahtjevuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resursi-u-zahtjevu")
@CrossOrigin(origins = "*")
public class ResursUZahtjevuController {
    private final ResursUZahtjevuService resursUZahtjevuService;

    public ResursUZahtjevuController(ResursUZahtjevuService resursUZahtjevuService) {
        this.resursUZahtjevuService = resursUZahtjevuService;
    }

    @GetMapping("/{idZahtjeva}")
    public ResponseEntity<List<ResursUZahtjevu>>getAllByIdZahtjeva(@PathVariable Integer idZahtjeva) throws NotFoundException {
        List<ResursUZahtjevu> r=resursUZahtjevuService.getByIdZahtjeva(idZahtjeva);
        return ResponseEntity.ok(r);
    }
}
