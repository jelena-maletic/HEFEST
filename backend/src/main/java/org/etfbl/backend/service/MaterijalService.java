package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.MaterijalEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.repository.MaterijalRepository;
import org.etfbl.backend.repository.RadnaOpremaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class MaterijalService {
    private final ModelMapper modelMapper;
    private final MaterijalRepository materijal;
    private final ResursService resursService;

    public MaterijalService(ModelMapper modelMapper, MaterijalRepository materijal, ResursService resursService) {
        this.modelMapper = modelMapper;
        this.materijal = materijal;
        this.resursService = resursService;
    }

    public List<Materijal> getAll() {
        return materijal.findAll().stream()
                .filter(m -> !m.getObrisan())
                .map(m -> modelMapper.map(m, Materijal.class )).toList();

    }

    public Materijal sacuvajMaterijal(Materijal dto) {
        MaterijalEntity entity = modelMapper.map(dto, MaterijalEntity.class);
        ResursEntity noviResurs = modelMapper.map(dto, ResursEntity.class);

        entity.setId(noviResurs.getId());

        MaterijalEntity sacuvano = materijal.save(entity);

        return modelMapper.map(sacuvano, Materijal.class);
    }

    @Transactional
    public Materijal updateMaterijal(Materijal dto){
        MaterijalEntity entity = modelMapper.map(dto, MaterijalEntity.class);
        Optional<MaterijalEntity> m = materijal.findById(entity.getId());

        if(m.isPresent()){
            MaterijalEntity materijalEntity = m.get();
            BeanUtils.copyProperties(entity, materijalEntity);

            return modelMapper.map(materijal.save(materijalEntity), Materijal.class);
        }
        else
            throw new RuntimeException("Materijal ne postoji");
    }

    public Materijal getMaterijalById(Integer id) {
        MaterijalEntity entity = materijal.findById(id)
                .orElseThrow(() -> new RuntimeException("Materijal nije pronađen"));
        return modelMapper.map(entity, Materijal.class);
    }

    public void obrisiMaterijal(Integer id) {
        if (!materijal.existsById(id)) {
            throw new RuntimeException("Materijal ne postoji.");
        }
        resursService.validirajBrisanje(id);
        materijal.deleteById(id);
    }
}
