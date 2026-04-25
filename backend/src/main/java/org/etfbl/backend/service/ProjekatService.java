package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.*;
import org.etfbl.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
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
    private final IzvjestajRepository izvjestajRepository;

    public ProjekatService(ProjekatRepository projekatRepository, ModelMapper modelMapper, DirektorRepository direktorRepository, PoslovodjaRepository poslovodjaRepository, PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository, TehnicarRepository tehnicarRepository, TehnicarNaProjektuRepository tehnicarNaProjektuRepository, IzvjestajRepository izvjestajRepository) {
        this.projekatRepository = projekatRepository;
        this.modelMapper = modelMapper;
        this.direktorRepository = direktorRepository;
        this.poslovodjaRepository = poslovodjaRepository;
        this.poslovodjaUpravljaProjektomRepository = poslovodjaUpravljaProjektomRepository;
        this.tehnicarRepository = tehnicarRepository;
        this.tehnicarNaProjektuRepository = tehnicarNaProjektuRepository;
        this.izvjestajRepository = izvjestajRepository;
    }

    public List<Projekat> getAllProjekti() {
        return projekatRepository.findAllByOrderByDatumKreiranjaDesc().stream()
                .filter(p -> !p.getObrisan())
                .map(this::mapToDto)
                .toList();
    }

    public Projekat sacuvajProjekat(Projekat dto) {

        ProjekatEntity entity = modelMapper.map(dto, ProjekatEntity.class);


        Instant sada = Instant.now();
        entity.setDatumKreiranja(sada);
        entity.setPosljednjaIzmjena(sada);
        entity.setObrisan(false);

        String jmb = dto.getUlogovaniJmb();
        if (jmb == null || jmb.trim().isEmpty() || "undefined".equals(jmb)) {

            throw new RuntimeException("Nevalidan JMB direktora: " + jmb);
        }

        try {
            entity.setDirektor(direktorRepository.getReferenceById(jmb));
        } catch (Exception e) {
            throw new RuntimeException("Direktor sa JMB-om " + jmb + " ne postoji u bazi.");
        }
        ProjekatEntity sacuvan = projekatRepository.save(entity);

        if (dto.getPoslovodja() != null) {
            PoslovodjaUpravljaProjektomEntity veza = new PoslovodjaUpravljaProjektomEntity();

           // veza.setIdProjekta(sacuvan.getIdProjekta());
           // veza.setPoslovodjaJMB(dto.getPoslovodja());

            veza.setProjekat(sacuvan);
            veza.setPoslovodja(poslovodjaRepository.getReferenceById(dto.getPoslovodja()));

            poslovodjaUpravljaProjektomRepository.save(veza);
        }



        if (dto.getTimTehnicara() != null && !dto.getTimTehnicara().isEmpty()) {
            for (String tehJmb : dto.getTimTehnicara()) {
                TehnicarNaProjektuEntity vezaTehnicar = new TehnicarNaProjektuEntity();
                vezaTehnicar.setIdProjekta(sacuvan.getIdProjekta());
                vezaTehnicar.setTehnicarJMB(tehJmb);
                vezaTehnicar.setProjekat(sacuvan);
                vezaTehnicar.setTehnicar(tehnicarRepository.getReferenceById(tehJmb));
                tehnicarNaProjektuRepository.save(vezaTehnicar);
            }
        }
        return modelMapper.map(sacuvan, Projekat.class);
    }

    public Projekat getProjekatById(Integer id) throws NotFoundException {
        ProjekatEntity entity = projekatRepository.findById(id)
                .filter(p -> !p.getObrisan())
                .orElseThrow(() -> new NotFoundException("Projekat sa id-om " + id + " nije pronađen."));

        return mapToDto(entity);
    }

    private Projekat mapToDto(ProjekatEntity entity) {
        Projekat dto = modelMapper.map(entity, Projekat.class);
        Integer id = entity.getIdProjekta();

        String managerJmb = poslovodjaUpravljaProjektomRepository.findPoslovodjaJmbByIdProjekta(id);
        dto.setPoslovodja(managerJmb);

        if (managerJmb != null) {
            poslovodjaRepository.findById(managerJmb).ifPresent(p -> {
                String punoIme = p.getIme() + " " + p.getPrezime();
                dto.setPoslovodjaImePrezime(punoIme);
            });
        }

        List<String> tehnicari = tehnicarNaProjektuRepository.findTehnicarJMBByIdProjekta(id);
        dto.setTimTehnicara(tehnicari);

        return dto;
    }

    public void obrisiProjekat(Integer id) {
        if (!projekatRepository.existsById(id)) {
            throw new RuntimeException("Projekat sa ID-om " + id + " ne postoji.");
        }
        if (izvjestajRepository.existsByPoslovodjaUpravljaProjektom_Projekat_IdProjekta(id)) {
            throw new RuntimeException("Projekat se ne može obrisati jer već postoje generisani izvještaji za njega!");
        }
        projekatRepository.deleteById(id);
    }

    public List<Projekat> pretraziPoLokaciji(String lokacija) throws NotFoundException {
        List<ProjekatEntity> projekti = projekatRepository.findAllByLokacijaContainingIgnoreCaseAndObrisanFalse(lokacija);
        if (projekti.isEmpty()) {
            throw new NotFoundException("Nema projekata na lokaciji: " + lokacija);
        }

        return projekti.stream()
                .map(this::mapToDto)
                .toList();
    }
    public List<Projekat> getProjektiZaTehnicara(String jmb) {
        return projekatRepository.findAllByTehnicarJmb(jmb).stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<Projekat> getProjektiZaPoslovodju(String jmb) {
        return projekatRepository.findAllByPoslovodjaJmb(jmb).stream()
                .map(this::mapToDto)
                .toList();
    }


    public List<String> getPostojeceLokacije() {
        return projekatRepository.findUniqueActiveLocations();
    }

    public Projekat updateProjekat(Integer id, Projekat dto) throws NotFoundException {
        ProjekatEntity postojeci = projekatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Projekat sa ID-om " + id + " ne postoji."));

        postojeci.setNaziv(dto.getNaziv());
        postojeci.setOpis(dto.getOpis());
        postojeci.setLokacija(dto.getLokacija());
        postojeci.setRok(dto.getRok());
        postojeci.setPocetakRada(dto.getPocetakRada());
        postojeci.setKrajRada(dto.getKrajRada());
        postojeci.setStatus(dto.getStatus());
        postojeci.setPrioritet(dto.getPrioritet());
        postojeci.setKlijent(dto.getKlijent());
        postojeci.setPosljednjaIzmjena(Instant.now());

        String noviPoslovodjaJmb = dto.getPoslovodja();
        String stariPoslovodjaJmb = poslovodjaUpravljaProjektomRepository.findPoslovodjaJmbByIdProjekta(id);

        if (noviPoslovodjaJmb != null && !noviPoslovodjaJmb.equals(stariPoslovodjaJmb)) {
            PoslovodjaUpravljaProjektomEntity novaVeza = new PoslovodjaUpravljaProjektomEntity();
            novaVeza.setProjekat(postojeci);
            novaVeza.setPoslovodja(poslovodjaRepository.getReferenceById(noviPoslovodjaJmb));

            poslovodjaUpravljaProjektomRepository.save(novaVeza);
        }

        tehnicarNaProjektuRepository.deleteByProjekatId(id);
        if (dto.getTimTehnicara() != null && !dto.getTimTehnicara().isEmpty()) {
            for (String tehJmb : dto.getTimTehnicara()) {
                TehnicarNaProjektuEntity vezaTehnicar = new TehnicarNaProjektuEntity();

                vezaTehnicar.setIdProjekta(postojeci.getIdProjekta());
                vezaTehnicar.setTehnicarJMB(tehJmb);

                vezaTehnicar.setProjekat(postojeci);
                vezaTehnicar.setTehnicar(tehnicarRepository.getReferenceById(tehJmb));

                tehnicarNaProjektuRepository.save(vezaTehnicar);
            }
        }
        ProjekatEntity sacuvan = projekatRepository.save(postojeci);
        return mapToDto(sacuvan);
    }
}

