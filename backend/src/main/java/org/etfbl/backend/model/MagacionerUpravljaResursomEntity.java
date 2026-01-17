package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.MagacionerUpravljaResursomId;

import java.io.Serializable;

@Data
@Entity
@Table(name = "Magacioner_Upravlja_Resursom")
@IdClass(MagacionerUpravljaResursomId.class)
public class MagacionerUpravljaResursomEntity implements Serializable {

    @Id
    @Column(name = "Magacioner_JMB")
    private String magacionerJMB;

    @Id
    @Column(name = "IdResursa")
    private Integer idResursa;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "Magacioner_JMB", referencedColumnName = "JMB",nullable = false)
    private MagacionerEntity magacionerJmb;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IdResursa",referencedColumnName = "IdResursa", nullable = false)
    private ResursEntity resurs;
}
