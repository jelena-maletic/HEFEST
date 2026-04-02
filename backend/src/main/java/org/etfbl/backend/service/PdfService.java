package org.etfbl.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.repository.UtroseniMaterijalRepository;
import org.springframework.stereotype.Service;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.pdf.BaseFont;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.stream.Stream;

@Service
public class PdfService {

    private final UtroseniMaterijalRepository utroseniMaterijalRepository;

    public PdfService(UtroseniMaterijalRepository utroseniMaterijalRepository) {
        this.utroseniMaterijalRepository = utroseniMaterijalRepository;
    }

    public byte[] generisiDnevniIzvjestajPdf(DnevniIzvjestaj dto) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 36, 36, 50, 50);
        PdfWriter.getInstance(document, out);

        String pathRegular = "fonts/Roboto-Regular.ttf";
        String pathBold = "fonts/Roboto-Bold.ttf";

        Font fontNaslov = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 18);
        Font fontSekcija = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12);
        Font fontBold = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10);
        Font fontObicni = FontFactory.getFont("Roboto-Regular", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10);
        document.open();

        Paragraph naslov = new Paragraph("DNEVNI IZVJEŠTAJ O RADU", fontNaslov);
        naslov.setAlignment(Element.ALIGN_CENTER);
        document.add(naslov);

        Paragraph podnaslov = new Paragraph("Broj izvještaja: #" + dto.getIdIzvjestaja(), fontObicni);
        podnaslov.setAlignment(Element.ALIGN_CENTER);
        document.add(podnaslov);
        document.add(new Paragraph(" "));

        PdfPTable mainTable = new PdfPTable(2);
        mainTable.setWidthPercentage(100);
        mainTable.setSpacingBefore(10f);

        dodajElegantanRed(mainTable, "PROJEKAT:", dto.getProjekat().getNaziv(), fontBold, fontObicni);
        dodajElegantanRed(mainTable, "IZVRŠILAC:", dto.getTehnicar().getIme() + " " + dto.getTehnicar().getPrezime(), fontBold, fontObicni);
        dodajElegantanRed(mainTable, "DATUM RADA:", dto.getDatum().toString(), fontBold, fontObicni);
        dodajElegantanRed(mainTable, "POSLOVOĐA:", dto.getPoslovodja().getIme() + " " + dto.getPoslovodja().getPrezime(), fontBold, fontObicni);

        document.add(mainTable);

        document.add(new Paragraph("\nEVIDENCIJA RADNIH SATI", fontSekcija));
        PdfPTable satiTable = new PdfPTable(5);
        satiTable.setWidthPercentage(100);
        satiTable.setSpacingBefore(5f);

        String[] satiHeaderi = {"Redovni", "Noćni", "Prekovremeni", "Terenski", "UKUPNO"};
        for (String h : satiHeaderi) {
            PdfPCell cell = new PdfPCell(new Phrase(h, fontBold));
            cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            satiTable.addCell(cell);
        }

        satiTable.addCell(kreirajCentriranuCeliju(dto.getSatiRada().toString(), fontObicni));
        satiTable.addCell(kreirajCentriranuCeliju(dto.getNocniSati().toString(), fontObicni));
        satiTable.addCell(kreirajCentriranuCeliju(dto.getPrekovremeniSati().toString(), fontObicni));
        satiTable.addCell(kreirajCentriranuCeliju(dto.getTerenskiSati().toString(), fontObicni));

        PdfPCell ukupnoCell = kreirajCentriranuCeliju(dto.getUkupniSati().toString(), fontBold);
        ukupnoCell.setBackgroundColor(new java.awt.Color(230, 240, 255)); // Blago plava za isticanje
        satiTable.addCell(ukupnoCell);

        document.add(satiTable);

        document.add(new Paragraph("\nOPIS IZVRŠENIH RADOVA", fontSekcija));
        Paragraph opis = new Paragraph(dto.getOpisRadova(), fontObicni);
        opis.setSpacingBefore(5f);
        document.add(opis);

        document.add(new Paragraph("\nUTROŠENI MATERIJAL I ELEMENTI", fontSekcija));

        PdfPTable matTable = new PdfPTable(7);
        matTable.setWidthPercentage(100);
        matTable.setSpacingBefore(5f);
        matTable.setWidths(new float[]{2.5f, 1f, 1f, 1.5f, 1.5f, 1.5f, 2f});

        String[] matHeaderi = {"Naziv", "Kol.", "Etaža", "Pozicija", "S. Krug", "Namjena", "Napomena"};
        for (String h : matHeaderi) {
            PdfPCell cell = new PdfPCell(new Phrase(h, fontBold));
            cell.setBackgroundColor(java.awt.Color.DARK_GRAY);
            cell.setPhrase(new Phrase(h, FontFactory.getFont("C:/Windows/Fonts/arialbd.ttf", "Identity-H", true, 9, Font.NORMAL, java.awt.Color.WHITE)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            matTable.addCell(cell);
        }

        var materijali = utroseniMaterijalRepository.nadjiSveZaIzvjestaj(dto.getIdIzvjestaja());
        for (var m : materijali) {
            matTable.addCell(new Phrase(m.getMaterijal().getNaziv(), fontObicni));
            matTable.addCell(kreirajCentriranuCeliju(m.getKolicina().toString(), fontObicni));
            matTable.addCell(new Phrase(m.getEtaza(), fontObicni));
            matTable.addCell(new Phrase(m.getPozicija(), fontObicni));
            matTable.addCell(new Phrase(m.getStrujniKrug(), fontObicni));
            matTable.addCell(new Phrase(m.getNamjena(), fontObicni));
            matTable.addCell(new Phrase(m.getNapomena(), fontObicni));
        }
        document.add(matTable);

        document.add(new Paragraph("\n\n\n\n"));

        PdfPTable potpisTable = new PdfPTable(2);
        potpisTable.setWidthPercentage(100);

        PdfPCell p1 = new PdfPCell();
        p1.setBorder(Rectangle.NO_BORDER);

        Paragraph linija1 = new Paragraph("__________________________", fontObicni);
        linija1.setAlignment(Element.ALIGN_CENTER);

        Paragraph tekst1 = new Paragraph("Potpis tehničara", fontObicni);
        tekst1.setAlignment(Element.ALIGN_CENTER);
        tekst1.setSpacingBefore(5f);

        p1.addElement(linija1);
        p1.addElement(tekst1);

        PdfPCell p2 = new PdfPCell();
        p2.setBorder(Rectangle.NO_BORDER);

        Paragraph linija2 = new Paragraph("__________________________", fontObicni);
        linija2.setAlignment(Element.ALIGN_CENTER);

        Paragraph tekst2 = new Paragraph("Potpis poslovođe", fontObicni);
        tekst2.setAlignment(Element.ALIGN_CENTER);
        tekst2.setSpacingBefore(5f);

        p2.addElement(linija2);
        p2.addElement(tekst2);

        potpisTable.addCell(p1);
        potpisTable.addCell(p2);
        document.add(potpisTable);

        document.close();
        return out.toByteArray();
    }

    private void dodajElegantanRed(PdfPTable table, String label, String value, Font b, Font o) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, b));
        c1.setBorder(Rectangle.BOTTOM);
        c1.setBorderColor(java.awt.Color.LIGHT_GRAY);
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, o));
        c2.setBorder(Rectangle.BOTTOM);
        c2.setBorderColor(java.awt.Color.LIGHT_GRAY);
        c2.setPadding(5);
        table.addCell(c2);
    }

    private PdfPCell kreirajCentriranuCeliju(String tekst, Font f) {
        PdfPCell cell = new PdfPCell(new Phrase(tekst, f));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5);
        return cell;
    }

    private void dodajRedUInfoTabelu(PdfPTable table, String label, String value, Font b, Font o) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, b));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, o));
        cellValue.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellValue);
    }

    public byte[] generisiSumarniIzvjestajPdf(SumarniIzvjestaj dto) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 50, 50);
        PdfWriter.getInstance(document, out);

        Font fontNaslov = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 18);
        Font fontSekcija = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12);
        Font fontBold = FontFactory.getFont("Roboto-Bold", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10);
        Font fontObicni = FontFactory.getFont("Roboto-Regular", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10);

        document.open();

        Paragraph naslov = new Paragraph("SUMARNI IZVJEŠTAJ O RADOVIMA", fontNaslov);
        naslov.setAlignment(Element.ALIGN_CENTER);
        document.add(naslov);
        document.add(new Paragraph(" "));

        PdfPTable mainTable = new PdfPTable(2);
        mainTable.setWidthPercentage(100);

        dodajElegantanRed(mainTable, "PROJEKAT:", dto.getProjekat().getNaziv(), fontBold, fontObicni);
        dodajElegantanRed(mainTable, "PERIOD IZVJEŠTAJA:", dto.getPocetniDatum() + " DO " + dto.getKrajnjiDatum(), fontBold, fontObicni);
        dodajElegantanRed(mainTable, "ODGOVORNO LICE:", dto.getPoslovodja().getIme() + " " + dto.getPoslovodja().getPrezime(), fontBold, fontObicni);

        PdfPCell c1 = new PdfPCell(new Phrase("UKUPNO RADNIH SATI:", fontBold));
        c1.setBackgroundColor(new java.awt.Color(230, 240, 255));
        c1.setPadding(8);
        mainTable.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(dto.getUkupniSatiRada().toString() + " h", fontBold));
        c2.setBackgroundColor(new java.awt.Color(230, 240, 255));
        c2.setPadding(8);
        mainTable.addCell(c2);

        document.add(mainTable);

        document.add(new Paragraph("\nDETALJAN PREGLED IZVRŠENIH AKTIVNOSTI", fontSekcija));
        document.add(new Paragraph(" "));

        PdfPTable opisBox = new PdfPTable(1);
        opisBox.setWidthPercentage(100);
        PdfPCell opisCell = new PdfPCell(new Phrase(dto.getOpis(), fontObicni));
        opisCell.setPadding(10);
        opisCell.setLeading(15f, 0f); // Razmak između redova teksta
        opisCell.setBackgroundColor(new java.awt.Color(252, 252, 252));
        opisBox.addCell(opisCell);

        document.add(opisBox);

        document.add(new Paragraph("\n\n\n\n"));
        PdfPTable potpisTable = new PdfPTable(2);
        potpisTable.setWidthPercentage(100);

        PdfPCell p1 = new PdfPCell();
        p1.setBorder(Rectangle.NO_BORDER);
        p1.setHorizontalAlignment(Element.ALIGN_CENTER);
        Paragraph l1 = new Paragraph("__________________________", fontObicni);
        l1.setAlignment(Element.ALIGN_CENTER);
        Paragraph t1 = new Paragraph("Potpis poslovođe", fontObicni);
        t1.setAlignment(Element.ALIGN_CENTER);
        t1.setSpacingBefore(5f);
        p1.addElement(l1); p1.addElement(t1);

        PdfPCell p2 = new PdfPCell();
        p2.setBorder(Rectangle.NO_BORDER);
        p2.setHorizontalAlignment(Element.ALIGN_CENTER);
        Paragraph l2 = new Paragraph("M.P.", fontObicni);
        l2.setAlignment(Element.ALIGN_CENTER);
        Paragraph t2 = new Paragraph("(Pečat firme)", fontObicni);
        t2.setAlignment(Element.ALIGN_CENTER);
        t2.setSpacingBefore(15f);
        p2.addElement(l2); p2.addElement(t2);

        potpisTable.addCell(p1);
        potpisTable.addCell(p2);
        document.add(potpisTable);

        document.close();
        return out.toByteArray();
    }
}