package org.etfbl.backend.controller;


import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.service.MagacionerUpravljaResursomService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/magacioner-resurs")
@CrossOrigin(origins = "*")
public class MagacionerUpravljaResursomController {


    private final MagacionerUpravljaResursomService service;

    public MagacionerUpravljaResursomController(MagacionerUpravljaResursomService s) {
        this.service = s;
    }


    @GetMapping
    public List<MagacionerUpravljaResursomEntity> getAll() {
        return service.getAllMagacionerUpravljaResursom();
    }
}
