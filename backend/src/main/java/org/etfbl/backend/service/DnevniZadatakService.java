package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.dto.DnevniZadatak;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.model.DnevniZadatakEntity;
import org.etfbl.backend.model.DnevniZadatakRequest;
import org.etfbl.backend.repository.DnevniZadatakRepository;
import org.etfbl.backend.repository.PoslovodjaRepository;
import org.etfbl.backend.repository.TehnicarRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class DnevniZadatakService {
    private final PoslovodjaRepository poslovodjaRepository;
    private final TehnicarRepository tehnicarRepository;
    private final DnevniZadatakRepository dnevniZadatakRepository;
    private final ModelMapper modelMapper;

    public DnevniZadatakService(PoslovodjaRepository poslovodjaRepository,
                                TehnicarRepository tehnicarRepository,
                                DnevniZadatakRepository dnevniZadatakRepository,
                                ModelMapper modelMapper) {
        this.poslovodjaRepository = poslovodjaRepository;
        this.tehnicarRepository = tehnicarRepository;
        this.dnevniZadatakRepository = dnevniZadatakRepository;
        this.modelMapper = modelMapper;
    }

    public List<DnevniZadatak> getAll() {
        return dnevniZadatakRepository.findAll().stream().map(entity -> {
            DnevniZadatak dto = modelMapper.map(entity, DnevniZadatak.class);

            // RUČNO MAPIRANJE ID-a (Entity.id -> DTO.idDnevnogZadatka)
            dto.setIdDnevnogZadatka(entity.getId());

            if (entity.getDnevniIzvjestaj() != null) {
                dto.setDnevniIzvjestaj(modelMapper.map(entity.getDnevniIzvjestaj(), DnevniIzvjestaj.class));
            }

            if (entity.getPoslovodja() != null) {
                dto.setPoslovodja(modelMapper.map(entity.getPoslovodja(), Poslovodja.class));
            }

            if (entity.getTehnicar() != null) {
                dto.setTehnicar(modelMapper.map(entity.getTehnicar(), Tehnicar.class));
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public DnevniZadatak create(DnevniZadatakRequest request) {
        DnevniZadatakEntity entity = new DnevniZadatakEntity();

        entity.setOpis(request.getOpis());
        entity.setDatum(request.getDatum());
        entity.setZavrsen(false);

        var tehnicar = tehnicarRepository.findById(request.getTehnicarJmb())
                .orElseThrow(() -> new RuntimeException("Tehničar nije pronađen"));
        entity.setTehnicar(tehnicar);

        var poslovodja = poslovodjaRepository.findById(request.getUlogovaniJmb())
                .orElseThrow(() -> new RuntimeException("Poslovođa nije pronađen"));
        entity.setPoslovodja(poslovodja);

        entity.setDnevniIzvjestaj(null);

        DnevniZadatakEntity saved = dnevniZadatakRepository.save(entity);

        DnevniZadatak dto = modelMapper.map(saved, DnevniZadatak.class);
        dto.setIdDnevnogZadatka(saved.getId()); // Mapiranje ID-a nakon snimanja
        return dto;
    }

    public void delete(Integer id) {
        if (!dnevniZadatakRepository.existsById(id)) {
            throw new RuntimeException("Zadatak sa ID-jem " + id + " ne postoji.");
        }
        dnevniZadatakRepository.deleteById(id);
    }

    public DnevniZadatak updateStatus(Integer id, Boolean zavrsen) {
        DnevniZadatakEntity entity = dnevniZadatakRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zadatak nije pronađen"));

        entity.setZavrsen(zavrsen);
        DnevniZadatakEntity updated = dnevniZadatakRepository.save(entity);

        DnevniZadatak dto = modelMapper.map(updated, DnevniZadatak.class);
        dto.setIdDnevnogZadatka(updated.getId());
        return dto;
    }

    public DnevniZadatak updateZadatak(Integer id, DnevniZadatakRequest request) {
        DnevniZadatakEntity entity = dnevniZadatakRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zadatak nije pronađen"));

        entity.setOpis(request.getOpis());
        entity.setDatum(request.getDatum());

        var tehnicar = tehnicarRepository.findById(request.getTehnicarJmb())
                .orElseThrow(() -> new RuntimeException("Tehničar nije pronađen"));
        entity.setTehnicar(tehnicar);

        DnevniZadatakEntity saved = dnevniZadatakRepository.save(entity);

        DnevniZadatak dto = modelMapper.map(saved, DnevniZadatak.class);
        dto.setIdDnevnogZadatka(saved.getId());
        return dto;
    }

    public DnevniZadatak getById(Integer id) {
        DnevniZadatakEntity entity = dnevniZadatakRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zadatak sa ID " + id + " nije pronađen"));

        DnevniZadatak dto = modelMapper.map(entity, DnevniZadatak.class);
        dto.setIdDnevnogZadatka(entity.getId()); // Ručno setujemo ID da ga frontend vidi

        // Ako treba mapirati i ostale objekte (izvještaj, tehničar...) kao u getAll():
        if (entity.getTehnicar() != null) {
            dto.setTehnicar(modelMapper.map(entity.getTehnicar(), org.etfbl.backend.dto.Tehnicar.class));
        }

        return dto;
    }
}