package org.etfbl.backend.service;

import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.dto.Zaduzenje;
import org.etfbl.backend.repository.ProjekatRepository;
import org.etfbl.backend.repository.ZaduzenjeRepository;


import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ZaduzenjeService {
    private final ZaduzenjeRepository zaduzenjeRepository;
    private final ModelMapper modelMapper;

    public ZaduzenjeService(ZaduzenjeRepository zaduzenjeRepository, ModelMapper modelMapper) {
        this.zaduzenjeRepository = zaduzenjeRepository;
        this.modelMapper = modelMapper;
    }

    public List<Zaduzenje> getZaduzenjaByPoslovodjaId(String poslovodjaId) {
        return zaduzenjeRepository.findAllByPoslovodjaJMB(poslovodjaId).stream().map(z -> modelMapper.map(z, Zaduzenje.class )).toList();
    }
}
