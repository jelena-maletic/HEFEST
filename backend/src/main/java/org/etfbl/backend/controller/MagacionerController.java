package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Knjigovodja;
import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.service.MagacionerService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/magacioneri")
@CrossOrigin(origins = "*")
public class MagacionerController {
    private final MagacionerService magacionerService;

    public MagacionerController(MagacionerService magacionerService) {
        this.magacionerService = magacionerService;
    }

    @GetMapping
    public List<Magacioner> getAll() {
        return magacionerService.getAll();
    }
}
