package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.repository.TehnicarRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Transactional
@Service
public class TehnicarService {
    private final TehnicarRepository tehnicarRepository;
    private final ModelMapper modelMapper;

    public TehnicarService(TehnicarRepository tehnicarRepository, ModelMapper modelMapper) {
        this.tehnicarRepository = tehnicarRepository;
        this.modelMapper = modelMapper;
    }

    public List<Tehnicar> getAll() { return tehnicarRepository.findAll().stream().map(t -> modelMapper.map(t, Tehnicar.class )).toList();}


    public List<Tehnicar> getAllOnlyTehnicari() {
        return tehnicarRepository.findAllOnlyTehnicari().stream().map(t -> modelMapper.map(t, Tehnicar.class )).toList();
    }

    public List<Tehnicar> getTehnicariZaPoslovodju(String jmb) {
        return tehnicarRepository.findTehnicariZaPoslovodju(jmb)
                .stream()
                .map(t -> modelMapper.map(t, Tehnicar.class))
                .toList();
    }

    public boolean updateAktivnost(String jmb, boolean noviStatus) {
        return tehnicarRepository.findById(jmb).map(tehnicar -> {
            tehnicar.setAktivan(noviStatus);
            tehnicarRepository.save(tehnicar);
            return true;
        }).orElse(false);
    }
}

