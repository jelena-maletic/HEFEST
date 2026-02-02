package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Resurs")
@SQLDelete(sql = "UPDATE Resurs SET Obrisan = 1 WHERE IdResursa = ?")
@Where(clause = "Obrisan = 0")
public class ResursEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdResursa", nullable = false)
    private Integer id;

    @Column(name = "Naziv", nullable = false, length = 100)
    private String naziv;

    @Column(name = "StanjeMagacina", nullable = false, precision = 5, scale = 2)
    private BigDecimal stanjeMagacina;

    @Column(name = "MinimalnaKolicina", precision = 5, scale = 2)
    private BigDecimal minimalnaKolicina;

    @ColumnDefault("0")
    @Column(name = "Obrisan", nullable = false)
    private Boolean obrisan = false;

}
