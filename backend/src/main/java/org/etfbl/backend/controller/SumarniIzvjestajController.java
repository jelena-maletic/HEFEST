package org.etfbl.backend.controller;

import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.etfbl.backend.service.PdfService;
import org.etfbl.backend.service.SumarniIzvjestajService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sumarni_izvjestaji")
@CrossOrigin(origins = "*")
public class SumarniIzvjestajController {
    private final SumarniIzvjestajService sumarniIzvjestajService;
    private final PdfService pdfService;

    public SumarniIzvjestajController(SumarniIzvjestajService sumarniIzvjestajService, PdfService pdfService) {
        this.sumarniIzvjestajService = sumarniIzvjestajService;
        this.pdfService = pdfService;
    }

    @GetMapping
    public List<SumarniIzvjestaj> findAll() {
        return sumarniIzvjestajService.getAll();
    }

    @GetMapping("/{id}")
    public SumarniIzvjestaj getOne(@PathVariable Integer id) {
        return sumarniIzvjestajService.getById(id);
    }

    @PostMapping
    public SumarniIzvjestaj create(@RequestBody SumarniIzvjestaj dto) {
        return sumarniIzvjestajService.create(dto);
    }

    @PutMapping("/{id}")
    public SumarniIzvjestaj update(@PathVariable Integer id, @RequestBody SumarniIzvjestaj dto) {
        return sumarniIzvjestajService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        sumarniIzvjestajService.delete(id);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Integer id) throws IOException {
        SumarniIzvjestaj dto = sumarniIzvjestajService.getById(id);
        byte[] pdf = pdfService.generisiSumarniIzvjestajPdf(dto);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Sumarni_Izvjestaj_" + id + ".pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
