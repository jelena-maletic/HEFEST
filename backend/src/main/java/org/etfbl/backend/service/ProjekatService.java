package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.model.DirektorEntity;
import org.etfbl.backend.model.ProjekatEntity;
import org.etfbl.backend.repository.DirektorRepository;
import org.etfbl.backend.repository.ProjekatRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Transactional
@Service
public class ProjekatService {

    final ModelMapper modelMapper;
    private final ProjekatRepository projekatRepository;
    final DirektorRepository direktorRepository;

    public ProjekatService(ProjekatRepository projekatRepository, ModelMapper modelMapper, DirektorRepository direktorRepository) {
        this.projekatRepository = projekatRepository;
        this.modelMapper = modelMapper;
        this.direktorRepository = direktorRepository;
    }

    public List<Projekat> getAllProjekti() {
        return projekatRepository.findAll().stream().map(projekat -> modelMapper.map(projekat, Projekat.class )).toList();
    }

    public Projekat sacuvajProjekat(Projekat dto) {
        ProjekatEntity entity = modelMapper.map(dto, ProjekatEntity.class);

        Instant sada = Instant.now();
        entity.setDatumKreiranja(sada);
        entity.setPosljednjaIzmjena(sada);
        //entity.setIdProjekta(2);

        DirektorEntity direktor = direktorRepository.findById(dto.getDirektorJMB())
                .orElseThrow(() -> new RuntimeException("Direktor ne postoji"));
        System.out.println(direktor.getJmb());
        entity.setDirektorJMB(direktor.getJmb());

        ProjekatEntity sacuvan = projekatRepository.save(entity);
        return modelMapper.map(sacuvan, Projekat.class);
    }

    public Projekat getProjekatById(Integer id) {
        ProjekatEntity entity = projekatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projekat sa ID " + id + " nije pronađen"));

        return modelMapper.map(entity, Projekat.class);
    }
}

