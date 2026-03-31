package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.UtroseniMaterijalEntity;
import org.etfbl.backend.repository.DnevniIzvjestajRepository;
import org.etfbl.backend.repository.MaterijalRepository;
import org.etfbl.backend.repository.UtroseniMaterijalRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class UtroseniMaterijalService {
    private final UtroseniMaterijalRepository utroseniMaterijalRepository;
    private final MaterijalRepository materijalRepository;
    private final DnevniIzvjestajRepository dnevniIzvjestajRepository;
    private final ModelMapper modelMapper;

    public UtroseniMaterijalService(UtroseniMaterijalRepository utroseniMaterijalRepository, MaterijalRepository materijalRepository, DnevniIzvjestajRepository dnevniIzvjestajRepository, ModelMapper modelMapper) {
        this.utroseniMaterijalRepository = utroseniMaterijalRepository;
        this.materijalRepository = materijalRepository;
        this.dnevniIzvjestajRepository = dnevniIzvjestajRepository;
        this.modelMapper = modelMapper;
    }

    public List<UtroseniMaterijal> getAllUtroseniMaterijal() {
        return utroseniMaterijalRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public UtroseniMaterijal getById(Integer id) {
        UtroseniMaterijalEntity entity = utroseniMaterijalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utrošeni materijal nije pronađen"));
        return mapToDto(entity);
    }

    public UtroseniMaterijal create(UtroseniMaterijal dto) {
        UtroseniMaterijalEntity entity = modelMapper.map(dto, UtroseniMaterijalEntity.class);

        entity.setMaterijal(materijalRepository.findById(dto.getIdMaterijala())
                .orElseThrow(() -> new RuntimeException("Materijal nije pronađen")));
        entity.setDnevniIzvjestaj(dnevniIzvjestajRepository.findById(dto.getIdIzvjestaja())
                .orElseThrow(() -> new RuntimeException("Dnevni izvještaj nije pronađen")));

        return mapToDto(utroseniMaterijalRepository.save(entity));
    }

    public UtroseniMaterijal update(Integer id, UtroseniMaterijal dto) {
        UtroseniMaterijalEntity postojeci = utroseniMaterijalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utrošeni materijal nije pronađen"));

        postojeci.setEtaza(dto.getEtaza());
        postojeci.setPozicija(dto.getPozicija());
        postojeci.setStrujniKrug(dto.getStrujniKrug());
        postojeci.setKolicina(dto.getKolicina());
        postojeci.setNamjena(dto.getNamjena());
        postojeci.setNapomena(dto.getNapomena());

        return mapToDto(utroseniMaterijalRepository.save(postojeci));
    }

    public void delete(Integer id) {
        utroseniMaterijalRepository.deleteById(id);
    }

    private UtroseniMaterijal mapToDto(UtroseniMaterijalEntity u) {
        UtroseniMaterijal dto = modelMapper.map(u, UtroseniMaterijal.class);

        if (u.getMaterijal() != null) {
            dto.setIdMaterijala(u.getMaterijal().getId());
        }

        if (u.getDnevniIzvjestaj() != null) {
            dto.setIdIzvjestaja(u.getDnevniIzvjestaj().getId());

        }

        return dto;
    }
}
