package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.service.TehnicarService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tehnicari")
@CrossOrigin(origins = "*")
public class TehnicarController {
    private final TehnicarService tehnicarService;

    public TehnicarController(TehnicarService tehnicarService) {
        this.tehnicarService = tehnicarService;
    }

    @GetMapping
    public List<Tehnicar> getAll() {
        return tehnicarService.getAll();
    }

    @GetMapping("/only")
    public List<Tehnicar> getAllOnlyTehnicari() {
        return tehnicarService.getAllOnlyTehnicari();
    }

    @GetMapping("/za-poslovodju/{jmb}")
    public List<Tehnicar> getZaPoslovodju(@PathVariable String jmb) {
        return tehnicarService.getTehnicariZaPoslovodju(jmb);
    }
}
