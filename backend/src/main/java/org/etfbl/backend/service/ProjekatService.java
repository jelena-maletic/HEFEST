package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.model.DirektorEntity;
import org.etfbl.backend.model.ProjekatEntity;
import org.etfbl.backend.repository.DirektorRepository;
import org.etfbl.backend.repository.ProjekatRepository;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Transactional
@Service
public class ProjekatService {

    private final ModelMapper modelMapper;
    private final ProjekatRepository projekatRepository;
    private final DirektorRepository direktorRepository;

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

        DirektorEntity direktor = direktorRepository.findById("1308003106401")
                .orElseThrow(() -> new RuntimeException("Direktor ne postoji"));
        //hardkodovani jmb je zbog toga sto nismo ulogovani kao doticni direktor, tako da bi tu islo tipa this.id

        entity.setDirektor(direktor);

        ProjekatEntity sacuvan = projekatRepository.save(entity);
        return modelMapper.map(sacuvan, Projekat.class);
    }

    public Projekat getProjekatById(Integer id) {
        ProjekatEntity entity = projekatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                       HttpStatus.NOT_FOUND, "Projekat sa ID-om " + id + " nije pronađen ili je obrisan"
                ));

        return modelMapper.map(entity, Projekat.class);
    }

    public void obrisiProjekat(Integer id) {
        if (!projekatRepository.existsById(id)) {
            throw new RuntimeException("Projekat sa ID-om " + id + " ne postoji.");
        }
        projekatRepository.deleteById(id);
    }

    public List<Projekat> pretraziPoLokaciji(String lokacija) {
        List<ProjekatEntity> projekti = projekatRepository.findAllByLokacijaContainingIgnoreCaseAndObrisanFalse(lokacija);

        // Ako pretraga ne vrati ništa, bacamo 404
        if (projekti.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Nema projekata na lokaciji: " + lokacija
            );
        }

        return projekti.stream()
                .map(p -> modelMapper.map(p, Projekat.class))
                .toList();
    }


    public List<String> getPostojeceLokacije() {
        return projekatRepository.findUniqueActiveLocations();
    }


}

