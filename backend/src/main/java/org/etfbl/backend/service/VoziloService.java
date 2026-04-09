package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.repository.VoziloRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class VoziloService {

    private final ModelMapper modelMapper;
    private final VoziloRepository voziloRepository;
    //private final ResursRepository resursRepository; // Moraš dodati ovaj repozitorijum

    public VoziloService(VoziloRepository voziloRepository, ModelMapper modelMapper) {
        this.voziloRepository = voziloRepository;
        this.modelMapper = modelMapper;
        //this.resursRepository = resursRepository;
    }

    public List<Vozilo> getAllVozilo() {
        // Filtriranje kao kod projekata (npr. ako imaš polje Obrisan u Resurs-u)
        return voziloRepository.findAll().stream()
                .filter(v -> !v.getObrisan())
                .map(v -> modelMapper.map(v, Vozilo.class))
                .toList();
    }

    public Vozilo sacuvajVozilo(Vozilo dto) {
        VoziloEntity entity = modelMapper.map(dto, VoziloEntity.class);
        ResursEntity noviResurs = modelMapper.map(dto, ResursEntity.class);

        entity.setId(noviResurs.getId());

        VoziloEntity sacuvano = voziloRepository.save(entity);

        return modelMapper.map(sacuvano, Vozilo.class);
    }

    @Transactional
    public Vozilo updateVozilo(Vozilo dto){
        VoziloEntity entity = modelMapper.map(dto, VoziloEntity.class);
        Optional<VoziloEntity> v = voziloRepository.findById(entity.getId());

        if(v.isPresent()){
            VoziloEntity voziloEntity = v.get();
            BeanUtils.copyProperties(entity, voziloEntity);
            voziloEntity.setDatumRegistracije(entity.getDatumRegistracije());
            voziloEntity.setDatumIstekaRegistracije(entity.getDatumIstekaRegistracije());
            return modelMapper.map(voziloRepository.save(voziloEntity), Vozilo.class);
        }
        else
            throw new RuntimeException("Vozilo ne postoji");
    }

    public Vozilo getVoziloById(Integer id) {
        VoziloEntity entity = voziloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vozilo nije pronađeno"));
        return modelMapper.map(entity, Vozilo.class);
    }

    public void obrisiVozilo(Integer id) {
        if (!voziloRepository.existsById(id)) {
            throw new RuntimeException("Vozilo ne postoji.");
        }
        voziloRepository.deleteById(id);
    }
}