package org.etfbl.backend.service;

import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.repository.MaterijalRepository;
import org.etfbl.backend.repository.RadnaOpremaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterijalService {
    private final ModelMapper modelMapper;
    private final MaterijalRepository materijal;

    public MaterijalService(ModelMapper modelMapper, MaterijalRepository materijal) {
        this.modelMapper = modelMapper;
        this.materijal = materijal;
    }

    public List<Materijal> getAll() {
        return materijal.findAll().stream().map(m -> modelMapper.map(m, Materijal.class )).toList();

    }
}
