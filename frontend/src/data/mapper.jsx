import React from 'react';
import { Tag } from 'antd';
import {formatDate, getStatusTagColor, getPriorityTagColor, calculateAgeFromJMBG} from '../utils/dataHelpers';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import greenPinIcon from "../assets/green-pin.svg";
import {MapContainer, Marker, TileLayer} from "react-leaflet";


const detailIcon = new L.Icon({
    iconUrl: greenPinIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
const safeValue = (value, fallback = 'Nema informacija.') => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
};
const isVisible = (userRole, allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole?.toLowerCase());
};

const groupItems = (items) => {
    return items.reduce((acc, item) => {
        const lastSection = acc[acc.length - 1];
        if (lastSection && lastSection.title === item.section) {
            lastSection.items.push(item);
        } else {
            acc.push({ title: item.section, items: [item] });
        }
        return acc;
    }, []);
};



const mapProjectDetails = (data,role) => {
    const allItems=[
        { section: 'Osnovne informacije', label: 'Naziv', value: data.naziv, key: 'naziv' },
        { section: 'Osnovne informacije', label: 'Opis', value: safeValue(data.opis), key: 'opis' },
        { section: 'Osnovne informacije', label: 'Prioritet', value: data.prioritet, key: 'prio',
            render: (v) => <Tag color={getPriorityTagColor(v)}>{v}</Tag> },
        { section: 'Osnovne informacije', label: 'Klijent', value: data.klijent, key: 'klijent' },
        {
            section: 'Osnovne informacije',
            label: 'Lokacija',
            value: data.lokacijaNaziv || data.lokacija,
            key: 'lokacija',
            span: 3,
            render: (textValue) => {
                const rawLocation = data.lokacija;
                let coords = null;

                if (rawLocation && typeof rawLocation === 'string' && rawLocation.includes(',')) {

                    const parts = rawLocation.split(',').map(p => p.trim());
                    const lat = Number(parts[0]);
                    const lng = Number(parts[1]);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        coords = [lat, lng];
                    }
                }

                return (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: '10px', fontWeight: '500' }}>
                            {textValue || "Lokacija nije definisana."}
                        </div>

                        {coords ? (
                            <div style={{ height: '250px', width: '100%', borderRadius: '8px', border: '1px solid #d9d9d9', overflow: 'hidden' }}>
                                <MapContainer
                                    key={`map-${coords[0]}-${coords[1]}`}
                                    center={coords}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={coords} icon={detailIcon} />
                                </MapContainer>
                            </div>
                        ) : (
                            <div style={{ padding: '8px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '4px', color: '#cf1322' }}>
                                ⚠️ Format koordinata u bazi nije ispravan za prikaz mape.
                            </div>
                        )}

                        {coords && (
                            <div style={{ marginTop: '10px' }}>
                                <a
                                    href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '13px', fontWeight: 'bold', color: '#1890ff' }}
                                >
                                    🗺️ Otvori navigaciju (Google Maps)
                                </a>
                            </div>
                        )}
                    </div>
                );
            }
        },
        { section: 'Vremenski okvir', label: 'Status', value: data.status, key: 'status',
            render: (v) => <Tag color={getStatusTagColor(v)}>{v}</Tag> },
        { section: 'Vremenski okvir', label: 'Početak rada', value: data.pocetakRada ? formatDate(data.pocetakRada): 'Nije definisan.', key: 'start' },
        { section: 'Vremenski okvir', label: 'Rok', value: formatDate(data.rok), key: 'deadline' },
        { section: 'Vremenski okvir', label: 'Kraj rada', value: data.krajRada ? formatDate(data.krajRada) : 'Nije definisan.', key: 'end' },
        {
            section: 'Tim na projektu',
            label: 'Odgovorni poslovođa',
            value: data.managerIme || data.manager,
            key: 'poslovodja_prikaz',
            roles: ['direktor'],
            render: (v) => v ? <strong>{v}</strong> : 'Nije dodijeljen.'
        },
        {
            section: 'Tim na projektu',
            label: 'Tim tehničara',
            value: data.projectTeamImena || data.projectTeam,
            key: 'tehnicari_prikaz',
            roles: ['direktor', 'poslovodja'],
            render: (imena) => (
                <div style={{ fontWeight: 'normal' }}>
                    {imena && imena.length > 0
                        ? imena.join(', ')
                        : 'Nema dodijeljenih tehničara.'}
                </div>
            )
        },
        {
            section: 'Kreiranje i izmjena projekta',
            label: 'Kreiranje projekta',
            value: formatDate(data.datumKreiranja),
            key: 'datumK',
            roles: ['direktor']
        },
        {
            section: 'Kreiranje i izmjena projekta',
            label: 'Posljednja izmjena projekta',
            value: formatDate(data.posljednjaIzmjena),
            key: 'datumI',
            roles: ['direktor']
        }
    ];
    const filteredItems = allItems.filter(item => isVisible(role, item.roles));
    return groupItems(filteredItems);
};

const mapEmployeeDetails = (data) => {
    return groupItems([
        { section: 'Lične informacije', label: 'Ime i prezime', value: `${data.ime} ${data.prezime}`, key: 'full_name' },

        {
            section: 'Lične informacije',
            label: 'Godine',
            value: calculateAgeFromJMBG( data.jmb),
            key: 'age'
        },
        { section: 'Lične informacije', label: 'Email', value: data.email, key: 'email' },
        { section: 'Lične informacije', label: 'Telefon', value: data.brojTelefona, key: 'tel' },


    ]);
};

const mapVehicleDetails = (data) => {
    return groupItems([
        { section: 'Tehnički podaci', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Tehnički podaci', label: 'Registracija', value: data.registarskiBroj, key: 'reg' },
        { section: 'Tehnički podaci', label: 'Tip vozila', value: data.tipVozila, key: 'type' },
        { section: 'Tehnički podaci', label: 'Broj putnika', value: data.brojPutnika, key: 'type' },
        { section: 'Tehnički podaci', label: 'Maksimalna nosivost', value: data.maksimalnaNosivost? `${data.maksimalnaNosivost} kg` : 'Nije navedeno', key: 'type' },
        { section: 'Dokumentacija', label: 'Registracija važi od', value: formatDate(data.datumRegistracije), key: 'reg_from' },
        { section: 'Dokumentacija', label: 'Registracija ističe', value: formatDate(data.datumIstekaRegistracije), key: 'reg_to' }
    ]);
};

const mapToolDetails = (data) => {
    return groupItems([
        { section: 'Osnovne informacije', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Osnovne informacije', label: 'Kategorija', value: data.kategorija, key: 'cat' },//enum
        { section: 'Skladište', label: 'Stanje u magacinu', value: data.stanjeMagacina, key: 'stock' },
        { section: 'Skladište', label: 'Minimalna količina', value: data.stanjeMagacina, key: 'state' }
    ]);
};
const mapMaterialDetails = (data) => {
    return groupItems([
        { section: 'Osnovne informacije', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Osnovne informacije', label: 'Kategorija', value: data.kategorija, key: 'type' },
        { section: 'Skladište', label: 'Trenutna količina', value: `${data.stanjeMagacina} ${data.jedinicaMjere || 'kom'}`, key: 'stock' },
        { section: 'Skladište', label: 'Minimalna količina', value: data.minimalnaKolicina, key: 'min_stock' }
    ]);
};

const mapRequestDetails = (data) => {
    return groupItems([
        {
            section: 'Osnovne informacije',
            label: 'Naziv resursa',
            value: data.resursNaziv,
            key: 'req_res_name',
            render: (v) => <strong style={{ fontSize: '15px', color: '#1890ff' }}>{safeValue(v)}</strong>
        },
        {
            section: 'Osnovne informacije',
            label: 'Količina',
            value: data.kolicina,
            key: 'req_qty',
            render: (v) => <strong>{v || 0}</strong>
        },
        {
            section: 'Osnovne informacije',
            label: 'Stanje zahtjeva',
            value: data.stanjeZahtjeva,
            key: 'req_state',
            render: (v) => {
                const val = v?.toLowerCase() === "neobradjen" ? "NEOBRAĐEN" : v;
                return <Tag color={getStatusTagColor(val)}>{val?.toUpperCase() || 'NEMA INFORMACIJA'}</Tag>
            }
        },

        {
            section: 'Osobe',
            label: 'Zahtjev podnio',
            value: data.poslovodjaImePrezime,
            key: 'req_mgr',
            render: (v) => <strong>{safeValue(v)}</strong>
        },
        {
            section: 'Osobe',
            label: 'Magacioner',
            value: data.magacionerImePrezime,
            key: 'req_wh',
            render: (v) => <span>{safeValue(v)}</span>
        },

        {
            section: 'Vremenski okvir',
            label: 'Datum slanja',
            value: formatDate(data.datumSlanja),
            key: 'req_date_sent'
        },
        {
            section: 'Vremenski okvir',
            label: 'Datum obrade',
            value: data.datumObrade ? formatDate(data.datumObrade) : 'Zahtjev nije obrađen.',
            key: 'req_date_proc'
        },

        {
            section: 'Opis zahtjeva',
            value: safeValue(data.opis, 'Nema informacija'),
            key: 'req_desc',
            span: 3
        }
    ]);
};



const mapDailyReportDetails = (data) => {
    return groupItems([
        {
            section: 'Informacije o radu',
            label: 'Projekat',
            value: data.projekat?.naziv || `ID: ${data.idProjekta}`,
            key: 'proj',
            render: (v) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{v}</span>
        },
        {
            section: 'Informacije o radu',
            label: 'Datum izvršenja',
            value: formatDate(data.datum),
            key: 'work_date'
        },
        {
            section: 'Informacije o radu',
            label: 'Opis radova',
            value: safeValue(data.opisRadova),
            key: 'desc',
            span: 3,
            render: (v) => <div style={{ fontStyle: 'italic', color: '#595959', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>{v}</div>
        },

        {
            section: 'Angažovano osoblje',
            label: 'Izvještaj podnio (Tehničar)',
            value: data.tehnicar ? `${data.tehnicar.ime} ${data.tehnicar.prezime}` : data.jmbTehnicar,
            key: 'tech'
        },
        {
            section: 'Angažovano osoblje',
            label: 'Odgovorni poslovođa',
            value: data.poslovodja ? `${data.poslovodja.ime} ${data.poslovodja.prezime}` : data.jmbPoslovodja,
            key: 'mgr'
        },

        {
            section: 'Specifikacija radnih sati',
            label: 'Redovni sati',
            value: data.satiRada,
            key: 'reg_h',
            render: (v) => <span><strong>{v || 0}</strong> h</span>
        },
        {
            section: 'Specifikacija radnih sati',
            label: 'Prekovremeni',
            value: data.prekovremeniSati,
            key: 'over_h',
            render: (v) => <span style={{ color: v > 0 ? '#faad14' : 'inherit' }}><strong>{v || 0}</strong> h</span>
        },
        {
            section: 'Specifikacija radnih sati',
            label: 'Noćni rad',
            value: data.nocniSati,
            key: 'night_h',
            render: (v) => <span style={{ color: v > 0 ? '#722ed1' : 'inherit' }}><strong>{v || 0}</strong> h</span>
        },
        {
            section: 'Specifikacija radnih sati',
            label: 'Terenski rad',
            value: data.terenskiSati,
            key: 'field_h',
            render: (v) => <span style={{ color: v > 0 ? '#13c2c2' : 'inherit' }}><strong>{v || 0}</strong> h</span>
        },
        {
            section: 'Specifikacija radnih sati',
            label: 'Ukupno angažovano',
            value: data.ukupniSati,
            key: 'total_h',
            span: 2,
            render: (v) => (
                <Tag color="blue" style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '4px' }}>
                    <strong>{v || 0} radnih sati</strong>
                </Tag>
            )
        },
        {
            section: 'Utrošeni materijal',
            value: data.utroseniMaterijali,
            key: 'materials_list',
            span: 3,
            render: (mats) => {
                if (!mats || mats.length === 0) {
                    return <div style={{ color: '#bfbfbf', padding: '8px' }}>Nema evidentiranog materijala za ovaj izvještaj.</div>;
                }

                return (
                    <div style={{ marginTop: '10px', overflowX: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '13px' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #f0f0f0' }}>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>Naziv</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center', color: '#8c8c8c', fontWeight: 600 }}>Kol.</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>Etaža</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>Pozicija</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>S. Krug</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>Namjena</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#8c8c8c', fontWeight: 600 }}>Napomena</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mats.map((m, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#262626' }}>
                                        {m.materijal?.naziv || "Nije definisano."}
                                    </td>

                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                        <Tag color="cyan" style={{ margin: 0 }}>
                                            {m.kolicina} {m.materijal?.jedinicaMjere || ''}
                                        </Tag>
                                    </td>

                                    <td style={{ padding: '10px 8px', color: '#595959' }}>
                                        {m.etaza || '-'}
                                    </td>

                                    <td style={{ padding: '10px 8px', color: '#595959' }}>
                                        {m.pozicija || '-'}
                                    </td>

                                    <td style={{ padding: '10px 8px', color: '#595959' }}>
                                        {m.strujniKrug || '-'}
                                    </td>

                                    <td style={{ padding: '10px 8px', color: '#595959' }}>
                                        {m.namjena || '-'}
                                    </td>

                                    <td style={{ padding: '10px 8px', fontStyle: 'italic', color: '#8c8c8c' }}>
                                        {m.napomena || '-'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
        }
    ]);
};


const mapTaskDetails = (data) => {
    return groupItems([
        {
            section: 'Status i vrijeme',
            label: 'Status zadatka',
            value: data.zavrsen ? 'Završen' : 'U toku',
            key: 'task_status',
            render: (v) => (
                <Tag color={v === 'Završen' ? 'green' : 'orange'} style={{ fontSize: '14px', padding: '2px 10px' }}>
                    {v.toUpperCase()}
                </Tag>
            )
        },
        {
            section: 'Status i vrijeme',
            label: 'Datum',
            value: formatDate(data.datum),
            key: 'task_date'
        },

        {
            section: 'Opis zadatka',
            label: 'Opis zadatka: ',
            value: safeValue(data.opis),
            key: 'task_desc',
            span: 3
        },

        {
            section: 'Učesnici',
            label: 'Zaduženi tehničar',
            value: data.tehnicar ? `${data.tehnicar.ime} ${data.tehnicar.prezime}` : 'Nije dodijeljen',
            key: 'task_tech',
            render: (v) => <strong>{v}</strong>
        },
        {
            section: 'Učesnici',
            label: 'Nadzorni poslovođa',
            value: data.poslovodja ? `${data.poslovodja.ime} ${data.poslovodja.prezime}` : 'Nema informacija',
            key: 'task_mgr'
        },

    ]);
};


const mapSummaryReportDetails = (data) => {
    return groupItems([

        {
            section: 'Osnovne informacije',
            label: 'Projekat',
            value: data.projekat?.naziv,
            key: 'sum_proj',
            render: (v) => <span style={{ fontWeight: 600, color: '#1890ff', fontSize: '15px' }}>{v}</span>
        },
        {
            section: 'Osnovne informacije',
            label: 'Datum Kreiranja',
            value: formatDate(data.datumKreiranja),
            key: 'sum_created'
        },
        {
            section: 'Obuhvaćeni period',
            label: 'Vremenski raspon',
            value: `${formatDate(data.pocetniDatum)} - ${formatDate(data.krajnjiDatum)}`,
            key: 'sum_period',
            span: 2,
            render: (v) => (
                <Tag color="cyan" style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '13px' }}>
                    📅 {v}
                </Tag>
            )
        },
        {
            section: 'Statistika i učinak',
            label: 'Ukupno radnih sati',
            value: data.ukupniSatiRada,
            key: 'sum_total_hours',
            render: (v) => (
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#096dd9' }}>
                    {v || 0} <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#595959' }}>h</span>
                </div>
            )
        },
        {
            section: 'Statistika i učinak',
            label: 'Odgovorni poslovođa',
            value: data.poslovodja ? `${data.poslovodja.ime} ${data.poslovodja.prezime}` : data.jmbPoslovodja,
            key: 'sum_mgr',
            render: (v) => <strong>{v}</strong>
        },

        {
            section: 'Zaključak / Opis',
            label: 'Dnevne zabilješke u periodu',
            value: data.opis,
            key: 'sum_desc',
            span: 3,
            render: (v) => {
                if (!v) return <i>Nema zabilješki</i>;

                const lines = v.split('•').map(line => line.trim()).filter(line => line.length > 0);

                return (
                    <div style={{ marginTop: '12px' }}>
                        {lines.map((line, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                marginBottom: '10px',
                                paddingBottom: '8px',
                                borderBottom: index !== lines.length - 1 ? '1px solid #f0f0f0' : 'none',
                                lineHeight: '1.5'
                            }}>
                                <span style={{ color: '#1890ff', marginRight: '10px' }}>•</span>
                                <span style={{ color: '#434343' }}>{line}</span>
                            </div>
                        ))}
                    </div>
                );
            }
        }
    ]);
};


const mapAssignmentDetails = (data) => {
    return groupItems([
        {
            section: 'Osnovne informacije',
            label: 'Naziv resursa',
            value: data.resursNaziv,
            key: 'resurs_ime',
            render: (v) => <strong style={{ fontSize: '15px' }}>{safeValue(v)}</strong>
        },
        {
            section: 'Osnovne informacije',
            label: 'Zadužena količina',
            value: data.zaduzenaKolicina,
            key: 'qty_assigned',
            render: (v) => <Tag color="blue">{v || 0}</Tag>
        },
        {
            section: 'Osnovne informacije',
            label: 'Razdužena količina',
            value: data.razduzenaKolicina,
            key: 'qty_returned',
            render: (v) => (
                <Tag color={v === data.zaduzenaKolicina ? 'green' : 'orange'}>
                    {v || 0}
                </Tag>
            )
        },

        {
            section: 'Osobe',
            label: 'Odgovorni poslovođa',
            value: data.poslovodjaImePrezime,
            key: 'assign_mgr',
            render: (v) => <strong>{safeValue(v)}</strong>
        },
        {
            section: 'Osobe',
            label: 'Izdao magacioner',
            value: data.magacionerImePrezime,
            key: 'assign_wh'
        },

        {
            section: 'Vremenski okvir',
            label: 'Datum zaduženja',
            value: formatDate(data.datumZaduzenja),
            key: 'date_assign'
        },
        {
            section: 'Vremenski okvir',
            label: 'Datum razduženja',
            value: data.datumRazduzenja ? formatDate(data.datumRazduzenja) : 'Još uvijek zaduženo',
            key: 'date_return',
            render: (v) => (
                <span style={{ color: v === 'Još uvijek zaduženo' ? '#faad14' : 'inherit', fontWeight: 500 }}>
                    {v}
                </span>
            )
        },

    ]);
};


export const mappers = {
    PROJECT: { title: 'Detalji projekta', mapper: mapProjectDetails },
    EMPLOYEE: { title: 'Detalji zaposlenog', mapper: mapEmployeeDetails },
    VEHICLE: { title: 'Detalji vozila', mapper: mapVehicleDetails },
    TOOL: { title: 'Detalji opreme', mapper: mapToolDetails },
    MATERIAL: {title: 'Detalji materijala', mapper: mapMaterialDetails },
    REQUEST: {title:'Detalji zahtjeva za resursima', mapper: mapRequestDetails},
    REPORT: { title: 'Detalji dnevnog izvještaja', mapper: mapDailyReportDetails },
    TASK: {title:'Detalji dnevnog zadatka', mapper: mapTaskDetails },
    SUMMARY_REPORT: {title:'Detalji sumarnog izvještaja', mapper: mapSummaryReportDetails},
    ASSIGNMENT: { title: 'Detalji zaduženja', mapper: mapAssignmentDetails }



};