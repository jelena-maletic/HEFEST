package org.etfbl.backend.controller;

import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.model.RadnaOpremaEntity;
import org.etfbl.backend.service.RadnaOpremaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/radna-oprema")
@CrossOrigin(origins = "*")
public class RadnaOpremaController {
    private final RadnaOpremaService radnaOpremaService;

    public RadnaOpremaController(RadnaOpremaService r) {
        this.radnaOpremaService = r;
    }

    @GetMapping
    public List<RadnaOprema> findAll() {
        return radnaOpremaService.getAll();
    }
}
