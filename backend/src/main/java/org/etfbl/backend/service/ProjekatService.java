package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.*;
import org.etfbl.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Transactional
@Service
public class ProjekatService {

    private final ModelMapper modelMapper;
    private final ProjekatRepository projekatRepository;
    private final DirektorRepository direktorRepository;
    private final PoslovodjaRepository poslovodjaRepository;
    private final PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository;
    private final TehnicarRepository tehnicarRepository;
    private final TehnicarNaProjektuRepository tehnicarNaProjektuRepository;
    public ProjekatService(ProjekatRepository projekatRepository, ModelMapper modelMapper, DirektorRepository direktorRepository, PoslovodjaRepository poslovodjaRepository, PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository, TehnicarRepository tehnicarRepository, TehnicarNaProjektuRepository tehnicarNaProjektuRepository) {
        this.projekatRepository = projekatRepository;
        this.modelMapper = modelMapper;
        this.direktorRepository = direktorRepository;
        this.poslovodjaRepository = poslovodjaRepository;
        this.poslovodjaUpravljaProjektomRepository = poslovodjaUpravljaProjektomRepository;
        this.tehnicarRepository = tehnicarRepository;
        this.tehnicarNaProjektuRepository = tehnicarNaProjektuRepository;
    }

    public List<Projekat> getAllProjekti() {
        return projekatRepository.findAll().stream().filter(p -> !p.getObrisan()).map(projekat -> modelMapper.map(projekat, Projekat.class )).toList();
    }

    public Projekat sacuvajProjekat(Projekat dto) {
        // 1. Mapiranje osnovnih polja
        ProjekatEntity entity = modelMapper.map(dto, ProjekatEntity.class);

        // 2. Vremenski pečati
        Instant sada = Instant.now();
        entity.setDatumKreiranja(sada);
        entity.setPosljednjaIzmjena(sada);
        entity.setObrisan(false); // Eksplicitno postavi na false za svaki slučaj

        // 3. SIGURNOSNA PROVJERA ZA JMB
        String jmb = dto.getUlogovaniJmb();
        if (jmb == null || jmb.trim().isEmpty() || "undefined".equals(jmb)) {
            // Ovdje možeš ili baciti grešku ili postaviti nekog defaultnog direktora za test
            throw new RuntimeException("Nevalidan JMB direktora: " + jmb);
        }


        // 4. Povezivanje direktora
        try {
            entity.setDirektor(direktorRepository.getReferenceById(jmb));
        } catch (Exception e) {
            throw new RuntimeException("Direktor sa JMB-om " + jmb + " ne postoji u bazi.");
        }
        // 5. Čuvanje
        ProjekatEntity sacuvan = projekatRepository.save(entity);

        if (dto.getPoslovodja() != null) {
            PoslovodjaUpravljaProjektomEntity veza = new PoslovodjaUpravljaProjektomEntity();

            // Postavljamo ID-ove (iz IdClass)
            veza.setIdProjekta(sacuvan.getIdProjekta());
            veza.setPoslovodjaJMB(dto.getPoslovodja());

            // Postavljamo objekte (zbog @MapsId i @ManyToOne)
            veza.setProjekat(sacuvan);
            veza.setPoslovodja(poslovodjaRepository.getReferenceById(dto.getPoslovodja()));

            // Snimamo u bazu u tabelu Poslovodja_Upravlja_Projektom
            poslovodjaUpravljaProjektomRepository.save(veza);
        }

        if (dto.getTimTehnicara() != null && !dto.getTimTehnicara().isEmpty()) {
            for (String tehJmb : dto.getTimTehnicara()) {
                // Kreiramo instancu veznog entiteta za svakog tehničara
                TehnicarNaProjektuEntity vezaTehnicar = new TehnicarNaProjektuEntity();

                // Postavljanje ID-ova (prilagodi nazive polja tvom entitetu)
                vezaTehnicar.setIdProjekta(sacuvan.getIdProjekta());
                vezaTehnicar.setTehnicarJMB(tehJmb);

                // Postavljanje relacija
                vezaTehnicar.setProjekat(sacuvan);
                vezaTehnicar.setTehnicar(tehnicarRepository.getReferenceById(tehJmb));

                // Snimanje u tabelu 'tehnicar_na_projektu'
                tehnicarNaProjektuRepository.save(vezaTehnicar);
            }
        }
        // 6. Mapiranje nazad u DTO
        return modelMapper.map(sacuvan, Projekat.class);
    }

    public Projekat getProjekatById(Integer id) throws NotFoundException{
        ProjekatEntity entity = projekatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Projekat sa id-om " + id + " nije pronađen."));

        return modelMapper.map(entity, Projekat.class);
    }

    public void obrisiProjekat(Integer id) {
        if (!projekatRepository.existsById(id)) {
            throw new RuntimeException("Projekat sa ID-om " + id + " ne postoji.");
        }
        projekatRepository.deleteById(id);
    }

    public List<Projekat> pretraziPoLokaciji(String lokacija) throws NotFoundException {
        List<ProjekatEntity> projekti = projekatRepository.findAllByLokacijaContainingIgnoreCaseAndObrisanFalse(lokacija);

        // Ako pretraga ne vrati ništa, bacamo 404
        if (projekti.isEmpty()) {
            throw new NotFoundException("Nema projekata na lokaciji: " + lokacija);
        }

        return projekti.stream()
                .map(p -> modelMapper.map(p, Projekat.class))
                .toList();
    }


    public List<String> getPostojeceLokacije() {
        return projekatRepository.findUniqueActiveLocations();
    }


}

