package org.etfbl.backend.service;

import org.etfbl.backend.dto.Resurs;
import org.etfbl.backend.model.ProjekatEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.repository.ResursRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResursService {

    private final ResursRepository resursRepository;
    private final ModelMapper modelMapper;


    public ResursService(ResursRepository resursRepository) {
        this.resursRepository = resursRepository;
        this.modelMapper = new ModelMapper();
    }

    public List<Resurs> getAllResursi() {
        return resursRepository.findAll().stream().filter(p -> !p.getObrisan()).map(resurs -> modelMapper.map(resurs, Resurs.class )).toList();
    }

    public Resurs sacuvajResurs(Resurs dto) {
        ResursEntity entity = modelMapper.map(dto, ResursEntity.class);
        ResursEntity sacuvan = resursRepository.save(entity);
        return modelMapper.map(sacuvan, Resurs.class);
    }
}
