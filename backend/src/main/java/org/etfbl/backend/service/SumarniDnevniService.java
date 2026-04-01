package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.SumarniDnevni;
import org.etfbl.backend.model.SumarniDnevniEntity;
import org.etfbl.backend.model.manytomanyid.SumarniDnevniId;
import org.etfbl.backend.repository.DnevniIzvjestajRepository;
import org.etfbl.backend.repository.SumarniDnevniRepository;
import org.etfbl.backend.repository.SumarniIzvjestajRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class SumarniDnevniService {

    private final SumarniDnevniRepository repository;
    private final SumarniIzvjestajRepository sumarniRepository;
    private final DnevniIzvjestajRepository dnevniRepository;
    private final ModelMapper modelMapper;

    public SumarniDnevniService(SumarniDnevniRepository repository,
                                SumarniIzvjestajRepository sumarniRepository,
                                DnevniIzvjestajRepository dnevniRepository,
                                ModelMapper modelMapper) {
        this.repository = repository;
        this.sumarniRepository = sumarniRepository;
        this.dnevniRepository = dnevniRepository;
        this.modelMapper = modelMapper;
    }

    public List<SumarniDnevni> getAll() {
        return repository.findAll().stream()
                .map(entity -> modelMapper.map(entity, SumarniDnevni.class))
                .toList();
    }

    public List<SumarniDnevni> getBySumarniId(Integer id) {
        return repository.findAllByIdSumarnogIzvjestaja(id).stream().map(this::mapToDto).toList();
    }

    public SumarniDnevni create(SumarniDnevni dto) {
        var sumarni = sumarniRepository.findById(dto.getIdSumarnogIzvjestaja())
                .orElseThrow(() -> new RuntimeException("Sumarni izvještaj nije pronađen"));
        var dnevni = dnevniRepository.findById(dto.getIdDnevnogIzvjestaja())
                .orElseThrow(() -> new RuntimeException("Dnevni izvještaj nije pronađen"));

        SumarniDnevniEntity entity = modelMapper.map(dto, SumarniDnevniEntity.class);

        entity.setSumarniIzvjestaj(sumarni);
        entity.setDnevniIzvjestaj(dnevni);

        return modelMapper.map(repository.save(entity), SumarniDnevni.class);
    }

    public void delete(Integer idSumarni, Integer idDnevni) {
        SumarniDnevniId id = new SumarniDnevniId();
        id.setIdSumarnogIzvjestaja(idSumarni);
        id.setIdDnevnogIzvjestaja(idDnevni);

        repository.deleteById(id);
    }

    private SumarniDnevni mapToDto(SumarniDnevniEntity entity) {
        SumarniDnevni dto = new SumarniDnevni();
        dto.setIdSumarnogIzvjestaja(entity.getIdSumarnogIzvjestaja());
        dto.setIdDnevnogIzvjestaja(entity.getIdDnevnogIzvjestaja());
        return dto;
    }
}