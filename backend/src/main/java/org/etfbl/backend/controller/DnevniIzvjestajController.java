package org.etfbl.backend.controller;

import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.service.DnevniIzvjestajService;
import org.etfbl.backend.service.PdfService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dnevni_izvjestaji")
@CrossOrigin(origins = "*")
public class DnevniIzvjestajController {
    private final DnevniIzvjestajService dnevniIzvjestajService;
    private final PdfService pdfService;

    public DnevniIzvjestajController(DnevniIzvjestajService dnevniIzvjestajService, PdfService pdfService) {
        this.dnevniIzvjestajService = dnevniIzvjestajService;
        this.pdfService = pdfService;
    }

    @GetMapping
    public List<DnevniIzvjestaj> findAll() {return dnevniIzvjestajService.getAll();}

    // Putanja: GET /api/dnevni_izvjestaji/projekat/1?od=2026-01-01&do=2026-01-31
    @GetMapping("/projekat/{idProjekta}")
    public List<DnevniIzvjestaj> getPoProjektuIPeriodu(
            @PathVariable Integer idProjekta,
            @RequestParam("od") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam("do") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate doDatuma) {

        return dnevniIzvjestajService.getIzvjestajiZaProjekatUPeriodu(idProjekta, od, doDatuma);
    }

    @GetMapping("/{id}")
    public DnevniIzvjestaj getOne(@PathVariable Integer id) {
        return dnevniIzvjestajService.getById(id);
    }

    @PostMapping
    public DnevniIzvjestaj create(@RequestBody DnevniIzvjestaj dto) {
        return dnevniIzvjestajService.create(dto);
    }

    @PutMapping("/{id}")
    public DnevniIzvjestaj update(@PathVariable Integer id, @RequestBody DnevniIzvjestaj dto) {
        return dnevniIzvjestajService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        dnevniIzvjestajService.delete(id);
    }

    @GetMapping("/{id}/pdf")
    public org.springframework.http.ResponseEntity<byte[]> downloadPdf(@PathVariable Integer id) throws java.io.IOException {
        DnevniIzvjestaj dto = dnevniIzvjestajService.getById(id);
        byte[] pdfContent = pdfService.generisiDnevniIzvjestajPdf(dto);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Izvjestaj_" + id + ".pdf");

        return new org.springframework.http.ResponseEntity<>(pdfContent, headers, org.springframework.http.HttpStatus.OK);
    }
}
