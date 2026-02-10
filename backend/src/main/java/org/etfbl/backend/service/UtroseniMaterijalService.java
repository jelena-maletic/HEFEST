package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.UtroseniMaterijal;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.repository.UtroseniMaterijalRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class UtroseniMaterijalService {
    private final UtroseniMaterijalRepository utroseniMaterijalRepository;
    private final ModelMapper modelMapper;

    public UtroseniMaterijalService(UtroseniMaterijalRepository utroseniMaterijalRepository, ModelMapper modelMapper) {
        this.utroseniMaterijalRepository = utroseniMaterijalRepository;
        this.modelMapper = modelMapper;
    }

    public List<UtroseniMaterijal> getAllUtroseniMaterijal() {
        return utroseniMaterijalRepository.findAll().stream().map(u -> {
            UtroseniMaterijal dto = new UtroseniMaterijal();
            dto.setEtaza(u.getEtaza());
            dto.setPozicija(u.getPozicija());
            dto.setStrujniKrug(u.getStrujniKrug());
            dto.setKolicina(u.getKolicina());
            dto.setNamjena(u.getNamjena());
            dto.setNapomena(u.getNapomena());

            if (u.getMaterijal() != null) {
                 dto.setMaterijal(modelMapper.map(u.getMaterijal(), Materijal.class));
            }
            return dto;
        }).toList();
    }
}
