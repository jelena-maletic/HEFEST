import React, { useState, useEffect } from "react";
import {
    Form, Select, DatePicker, InputNumber,
    Input, Button, Card, Divider
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../auth/axiosInstance.js";
import { useNotification } from "./NotificationContext.jsx";

const { Option } = Select;
const { TextArea } = Input;

const PRAZNA_STAVKA = () => ({
    _localId: Date.now() + Math.random(),
    idMaterijala: undefined,
    kolicina: null,
    etaza: "",
    pozicija: "",
    strujniKrug: "",
    namjena: "",
    napomena: ""
});

const CreateDnevniIzvjestajForm = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [projekti, setProjekti] = useState([]);
    const [materijali, setMaterijali] = useState([]);
    const [stavke, setStavke] = useState([]);
    const [loading, setLoading] = useState(false);
    const notify = useNotification();

    useEffect(() => {
        api.service(true).get("http://localhost:8080/api/projekti")
            .then(res => setProjekti(Array.isArray(res.data) ? res.data : []))
            .catch(() => notify.error("Greška", "Učitavanje projekata nije uspjelo."));

        api.service(true).get("http://localhost:8080/api/materijal")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                //console.log("Materijal primjer:", data[0]);
                setMaterijali(data);
            })
            .catch(() => notify.error("Greška", "Učitavanje materijala nije uspjelo."));
    }, []);

    const dodajStavku = () => {
        setStavke(prev => [...prev, PRAZNA_STAVKA()]);
    };

    const ukloniStavku = (localId) => {
        setStavke(prev => prev.filter(s => s._localId !== localId));
    };

    const updateStavka = (localId, field, value) => {
        setStavke(prev =>
            prev.map(s => s._localId === localId ? { ...s, [field]: value } : s)
        );
    };

    const validirajStavke = () => {
        for (let i = 0; i < stavke.length; i++) {
            const s = stavke[i];
            if (!s.idMaterijala) {
                notify.error("Greška u stavci", `Stavka ${i + 1}: odaberite materijal.`);
                return false;
            }
            if (!s.kolicina || s.kolicina <= 0) {
                notify.error("Greška u stavci", `Stavka ${i + 1}: unesite ispravnu količinu.`);
                return false;
            }
            if (!s.pozicija?.trim()) {
                notify.error("Greška u stavci", `Stavka ${i + 1}: pozicija je obavezna.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!validirajStavke()) return;

            setLoading(true);

            const ulogovaniJmb = sessionStorage.getItem('jmb');

            const izvjestajPayload = {
                idProjekta: values.idProjekta,
                jmbTehnicar: ulogovaniJmb,
                datum: values.datum?.format("YYYY-MM-DD"),
                ukupniSati: values.ukupniSati,
                satiRada: values.satiRada,
                prekovremeniSati: values.prekovremeniSati ?? 0,
                nocniSati: values.nocniSati ?? 0,
                terenskiSati: values.terenskiSati ?? 0,
                opisRadova: values.opisRadova,
            };

            console.log(izvjestajPayload)

            const izvjestajRes = await api.service(true).post(
                "http://localhost:8080/api/dnevni_izvjestaji",
                izvjestajPayload
            );

            const idIzvjestaja =
                izvjestajRes.data?.idIzvjestaja ||
                izvjestajRes.data?.id ||
                izvjestajRes.data;

            const materijalRequests = stavke.map(({ _localId, ...stavka }) =>
                api.service(false).post(
                    `http://localhost:8080/api/utroseni_materijali`,
                    { ...stavka, idIzvjestaja }
                )
            );

            await Promise.all(materijalRequests);

            notify.success("Uspješno", "Dnevni izvještaj je kreiran.");
            form.resetFields();
            setStavke([]);
            onSuccess?.();
            onClose?.();

        } catch (err) {
            if (err?.errorFields) return;
            console.error(err);
            notify.error("Greška", "Kreiranje izvještaja nije uspjelo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title="Novi dnevni izvještaj"
            style={{ width: 860, maxHeight: "85vh", overflowY: "auto" }}
        >
            <Form form={form} layout="vertical">

                <Divider orientation="left">Osnovni podaci</Divider>

                <div style={{ display: "flex", gap: 16 }}>
                    <Form.Item
                        name="idProjekta"
                        label="Projekat"
                        rules={[{ required: true, message: "Odaberite projekat!" }]}
                        style={{ flex: 1 }}
                    >
                        <Select placeholder="Odaberite projekat" showSearch
                                optionFilterProp="children" allowClear>
                            {projekti.map(p => (
                                <Option key={String(p.id)} value={String(p.id)}>
                                    {p.naziv}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="datum"
                        label="Datum"
                        rules={[{ required: true, message: "Odaberite datum!" }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                    <Form.Item name="ukupniSati" label="Ukupni sati"
                               rules={[{ required: true, message: "Unesite ukupne sate!" }]}
                               style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="satiRada" label="Redovni radni sati"
                               rules={[{ required: true, message: "Unesite sate rada!" }]}
                               style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="prekovremeniSati" label="Prekovremeni sati"
                               style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                    <Form.Item name="nocniSati" label="Noćni rad (sati)"
                               style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="terenskiSati" label="Terenski dodatak (sati)"
                               style={{ flex: 1 }}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <div style={{ flex: 1 }} />
                </div>

                <Form.Item name="opisRadova" label="Opis izvedenih radova"
                           rules={[{ required: true, message: "Unesite opis radova!" }]}>
                    <TextArea rows={3} />
                </Form.Item>

                <Divider orientation="left">Utrošeni materijal</Divider>

                {stavke.length === 0 && (
                    <p style={{ color: "#aaa", marginBottom: 12, fontSize: 13 }}>
                        Nema dodanih stavki. Kliknite dugme ispod da dodate materijal.
                    </p>
                )}

                {stavke.map((stavka, index) => (
                    <Card
                        key={stavka._localId}
                        size="small"
                        style={{ marginBottom: 12, borderColor: "#e8e8e8" }}
                        title={
                            <span style={{ fontWeight: 500, fontSize: 13 }}>
                                Materijal #{index + 1}
                            </span>
                        }
                        extra={
                            <Button type="text" danger size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => ukloniStavku(stavka._localId)}>
                                Ukloni
                            </Button>
                        }
                    >
                        <div style={{ display: "flex", gap: 16 }}>
                            <Form.Item label="Materijal" required style={{ flex: 2, marginBottom: 8 }}>
                                <Select
                                    placeholder="Odaberite materijal"
                                    showSearch optionFilterProp="children" allowClear
                                    value={stavka.idMaterijala}
                                    onChange={val => updateStavka(stavka._localId, "idMaterijala", val)}
                                >
                                    {materijali.map(m => (
                                        <Option key={String(m.id)} value={String(m.id)}>
                                            {m.naziv}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Količina" required style={{ flex: 1, marginBottom: 8 }}>
                                <InputNumber
                                    min={0.01} style={{ width: "100%" }}
                                    value={stavka.kolicina}
                                    onChange={val => updateStavka(stavka._localId, "kolicina", val)}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <Form.Item label="Etaža / Sprat" style={{ flex: 1, marginBottom: 8 }}>
                                <Input maxLength={45} value={stavka.etaza}
                                       onChange={e => updateStavka(stavka._localId, "etaza", e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Pozicija (Mjesto ugradnje)" required
                                       style={{ flex: 1, marginBottom: 8 }}>
                                <Input maxLength={45} value={stavka.pozicija}
                                       onChange={e => updateStavka(stavka._localId, "pozicija", e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Strujni krug" style={{ flex: 1, marginBottom: 8 }}>
                                <Input maxLength={45} value={stavka.strujniKrug}
                                       onChange={e => updateStavka(stavka._localId, "strujniKrug", e.target.value)} />
                            </Form.Item>
                        </div>

                        <div style={{ display: "flex", gap: 16 }}>
                            <Form.Item label="Namjena" style={{ flex: 1, marginBottom: 0 }}>
                                <Input maxLength={100} value={stavka.namjena}
                                       onChange={e => updateStavka(stavka._localId, "namjena", e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Napomena" style={{ flex: 1, marginBottom: 0 }}>
                                <TextArea rows={1} value={stavka.napomena}
                                          onChange={e => updateStavka(stavka._localId, "napomena", e.target.value)} />
                            </Form.Item>
                        </div>
                    </Card>
                ))}

                <Button
                    type="dashed" icon={<PlusOutlined />}
                    onClick={dodajStavku}
                    style={{ width: "100%", marginBottom: 20 }}
                >
                     Dodaj materijal
                </Button>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <Button onClick={() => { form.resetFields(); setStavke([]); onClose?.(); }}>
                        Odustani
                    </Button>
                    <Button type="primary" loading={loading} onClick={handleSubmit}>
                        Kreiraj izvještaj
                    </Button>
                </div>

            </Form>
        </Card>
    );
};

export default CreateDnevniIzvjestajForm;