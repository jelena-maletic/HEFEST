package org.etfbl.backend.controller;


import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.dto.PromjenaLozinkeRequest;
import org.etfbl.backend.service.KorisnikService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/korisnici")
@CrossOrigin(origins = "*")
public class KorisnikController {
    private final KorisnikService korisnikService;

    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @GetMapping("/{jmb}")
    public String getImeIPrezimeByJmb(@PathVariable String jmb) {
        return korisnikService.getImeIPrezimeByJmb(jmb);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PromjenaLozinkeRequest request) {
        korisnikService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
