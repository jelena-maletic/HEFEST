package org.etfbl.backend.service;

import org.etfbl.backend.dto.Resurs;
import org.etfbl.backend.model.ProjekatEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.repository.ResursRepository;
import org.etfbl.backend.repository.UtroseniMaterijalRepository;
import org.etfbl.backend.repository.ZaduzenjeRepository;
import org.etfbl.backend.repository.ZahtjevZaResursimaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResursService {

    private final ResursRepository resursRepository;
    private final ModelMapper modelMapper;
    private final ZahtjevZaResursimaRepository zahtjevRepository;
    private final ZaduzenjeRepository zaduzenjeRepository;
    private final UtroseniMaterijalRepository utroseniMaterijalRepository;

    public ResursService(ResursRepository resursRepository, ZahtjevZaResursimaRepository zahtjevRepository, ZaduzenjeRepository zaduzenjeRepository, UtroseniMaterijalRepository utroseniMaterijalRepository) {
        this.resursRepository = resursRepository;
        this.zahtjevRepository = zahtjevRepository;
        this.zaduzenjeRepository = zaduzenjeRepository;
        this.utroseniMaterijalRepository = utroseniMaterijalRepository;
        this.modelMapper = new ModelMapper();
    }

    public List<Resurs> getAllResursi() {
        return resursRepository.findAll().stream().filter(p -> !p.getObrisan()).map(resurs -> modelMapper.map(resurs, Resurs.class )).toList();
    }

    public Resurs sacuvajResurs(Resurs dto) {
        ResursEntity entity = modelMapper.map(dto, ResursEntity.class);
        ResursEntity sacuvan = resursRepository.save(entity);
        return modelMapper.map(sacuvan, Resurs.class);
    }

    public void validirajBrisanje(Integer id) {
        if (zahtjevRepository.existsByResurs_Id(id)) {
            throw new RuntimeException("Resurs se ne može obrisati jer postoje zahtjevi za njim.");
        }

        if (zaduzenjeRepository.existsByResurs_Id(id)) {
            throw new RuntimeException("Resurs se ne može obrisati jer postoje aktivna zaduženja.");
        }

        if (utroseniMaterijalRepository.existsByMaterijal_Id(id)) {
            throw new RuntimeException("Materijal se ne može obrisati jer je registrovan u utrošku.");
        }
    }
}
