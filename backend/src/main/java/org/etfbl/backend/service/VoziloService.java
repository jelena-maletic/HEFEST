package org.etfbl.backend.service;


import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.repository.VoziloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoziloService {
    private final VoziloRepository voziloRepository;

    public VoziloService(VoziloRepository voziloRepository) {
        this.voziloRepository = voziloRepository;
    }

    public List<VoziloEntity> getAllVozilo() {
        return voziloRepository.findAll();
    }



}
