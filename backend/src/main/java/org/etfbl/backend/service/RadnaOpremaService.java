package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.RadnaOpremaEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.repository.RadnaOpremaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class RadnaOpremaService {
    private final ModelMapper modelMapper;
    private final RadnaOpremaRepository radnaOpremaRepository;

    public RadnaOpremaService(ModelMapper modelMapper, RadnaOpremaRepository radnaOpremaRepository) {
        this.modelMapper = modelMapper;
        this.radnaOpremaRepository = radnaOpremaRepository;
    }

    public List<RadnaOprema> getAllRadnaOprema() {
        return radnaOpremaRepository.findAll().stream()
                .filter(ro -> !ro.getObrisan())
                .map(ro -> modelMapper.map(ro, RadnaOprema.class))
                .toList();
    }

    public RadnaOprema sacuvajRadnuOpremu(RadnaOprema dto) {
        RadnaOpremaEntity entity = modelMapper.map(dto, RadnaOpremaEntity.class);

        RadnaOpremaEntity sacuvano = radnaOpremaRepository.save(entity);
        return modelMapper.map(sacuvano, RadnaOprema.class);
    }

    @Transactional
    public RadnaOprema updateRadnaOprema(RadnaOprema dto){
        RadnaOpremaEntity entity = modelMapper.map(dto, RadnaOpremaEntity.class);
        Optional<RadnaOpremaEntity> ro = radnaOpremaRepository.findById(entity.getId());

        if(ro.isPresent()){
            RadnaOpremaEntity radnaOpremaEntity = ro.get();
            BeanUtils.copyProperties(entity, radnaOpremaEntity);
            return modelMapper.map(radnaOpremaRepository.save(radnaOpremaEntity), RadnaOprema.class);
        }
        else
            throw new RuntimeException("Radna oprema ne postoji");
    }

    public RadnaOprema getRadnaOpremaById(Integer id) {
        RadnaOpremaEntity entity = radnaOpremaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radna oprema nije pronađena"));
        return modelMapper.map(entity, RadnaOprema.class);
    }

    public void obrisiRadnuOpremu(Integer id) {
        if (!radnaOpremaRepository.existsById(id)) {
            throw new RuntimeException("Radna oprema ne postoji.");
        }
        radnaOpremaRepository.deleteById(id);
    }
}
