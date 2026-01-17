package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.repository.MagacionerUpravljaResursomRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class MagacionerUpravljaResursomService {

    private final MagacionerUpravljaResursomRepository magacionerUpravljaResursomRepository;
    private final ModelMapper modelMapper;

    public MagacionerUpravljaResursomService(MagacionerUpravljaResursomRepository m, ModelMapper modelMapper) {
        this.magacionerUpravljaResursomRepository = m;
        this.modelMapper = modelMapper;
    }

    public List<MagacionerUpravljaResursomEntity> getAllMagacionerUpravljaResursom() {
        return magacionerUpravljaResursomRepository.findAll();
    }
}
