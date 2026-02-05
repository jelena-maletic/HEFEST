package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.ResursUZahtjevu;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.repository.ResursUZahtjevuRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class ResursUZahtjevuService {
    private final ResursUZahtjevuRepository resursUZahtjevuRepository;
    private final ModelMapper modelMapper;

    public ResursUZahtjevuService(ResursUZahtjevuRepository resursUZahtjevuRepository, ModelMapper modelMapper) {
        this.resursUZahtjevuRepository = resursUZahtjevuRepository;
        this.modelMapper = modelMapper;
    }
    
    public List<ResursUZahtjevu> getByIdZahtjeva(Integer idZahtjeva) {
        return resursUZahtjevuRepository.findAllByIdZahtjeva(idZahtjeva).stream().map(resurs -> modelMapper.map(resurs,ResursUZahtjevu.class )).toList();
    } 
    
}
