import React, { useState, useEffect } from "react";
import {
    Form, Select, DatePicker, InputNumber,
    Input, Button, Card, Divider, Row, Col, Space, Checkbox, Alert
} from "antd";
import { PlusOutlined, DeleteOutlined, FileTextOutlined,
    BuildOutlined, SolutionOutlined, ImportOutlined } from "@ant-design/icons";
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

const CreateDnevniIzvjestajForm = ({ onClose, onSuccess, role }) => {
    const [form] = Form.useForm();
    const [projekti, setProjekti] = useState([]);
    const [materijali, setMaterijali] = useState([]);
    const [stavke, setStavke] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pronadjeniZadaci, setPronadjeniZadaci] = useState([]);
    const [odabraniZadaci, setOdabraniZadaci] = useState([]);
    const notify = useNotification();

    const odabraniDatum = Form.useWatch('datum', form);

    // useEffect(() => {
    //     api.service(true).get("http://localhost:8080/api/projekti")
    //         .then(res => setProjekti(Array.isArray(res.data) ? res.data : []))
    //         .catch(() => notify.error("Greška", "Učitavanje projekata nije uspjelo."));
    //
    //     api.service(true).get("http://localhost:8080/api/materijal")
    //         .then(res => setMaterijali(Array.isArray(res.data) ? res.data : []))
    //         .catch(() => notify.error("Greška", "Učitavanje materijala nije uspjelo."));
    // }, []);
    useEffect(() => {
        const jmb = sessionStorage.getItem('jmb');
        let projektiUrl = "http://localhost:8080/api/projekti";

        // Dinamički biramo URL na osnovu uloge
        if (role === "tehnicar") {
            projektiUrl = `http://localhost:8080/api/projekti/tehnicar/${jmb}`;
        } else if (role === "poslovodja") {
            projektiUrl = `http://localhost:8080/api/projekti/poslovodja/${jmb}`;
        }

        // Učitavanje filtriranih projekata
        api.service(true).get(projektiUrl)
            .then(res => setProjekti(Array.isArray(res.data) ? res.data : []))
            .catch(() => notify.error("Greška", "Učitavanje projekata nije uspjelo."));

        // Učitavanje materijala ostaje isto
        api.service(true).get("http://localhost:8080/api/materijal")
            .then(res => setMaterijali(Array.isArray(res.data) ? res.data : []))
            .catch(() => notify.error("Greška", "Učitavanje materijala nije uspjelo."));
    }, [role]); // Dodali smo role u dependency niz

    useEffect(() => {
        if (odabraniDatum) {
            const jmb = sessionStorage.getItem('jmb');
            const dateStr = odabraniDatum.format("YYYY-MM-DD");

            api.service(true).get(`http://localhost:8080/api/dnevni_zadaci/tehnicar/${jmb}/zavrseni?datum=${dateStr}`)
                .then(res => {
                    setPronadjeniZadaci(res.data || []);
                    setOdabraniZadaci([]);
                })
                .catch(err => {
                    console.error("Greška pri dohvatanju zadataka", err);
                    setPronadjeniZadaci([]);
                });
        }
    }, [odabraniDatum]);

    const ubaciZadatkeUOpis = () => {
        if (odabraniZadaci.length === 0) return;

        const noviTekst = odabraniZadaci.join("\n");
        const trenutniOpis = form.getFieldValue('opisRadova') || "";

        form.setFieldsValue({
            opisRadova: trenutniOpis ? `${trenutniOpis}\n${noviTekst}` : noviTekst
        });

        setPronadjeniZadaci([]);
        //setOdabraniZadaci([]);
        notify.success("Uspješno", "Zadaci dodati u opis.");
    };

    const dodajStavku = () => setStavke(prev => [...prev, PRAZNA_STAVKA()]);
    const ukloniStavku = (localId) => setStavke(prev => prev.filter(s => s._localId !== localId));
    const updateStavka = (localId, field, value) => {
        setStavke(prev => prev.map(s => s._localId === localId ? { ...s, [field]: value } : s));
    };

    const validirajStavke = () => {
        for (let i = 0; i < stavke.length; i++) {
            const s = stavke[i];
            if (!s.idMaterijala || !s.kolicina || s.kolicina <= 0 || !s.pozicija?.trim()) {
                notify.error("Validacija", `Stavka ${i + 1} nije kompletna.`);
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

            const izvjestajRes = await api.service(true).post("http://localhost:8080/api/dnevni_izvjestaji", izvjestajPayload);
            const idIzvjestaja = izvjestajRes.data?.idIzvjestaja || izvjestajRes.data?.id || izvjestajRes.data;

            const materijalRequests = stavke.map(({ _localId, ...stavka }) =>
                api.service(false).post(`http://localhost:8080/api/utroseni_materijali`, { ...stavka, idIzvjestaja })
            );

            await Promise.all(materijalRequests);
            notify.success("Uspješno", "Izvještaj je sačuvan.");
            form.resetFields();
            setStavke([]);
            onSuccess?.();
            onClose?.();
        } catch (err) {
            if (!err?.errorFields) notify.error("Greška", "Slanje podataka nije uspjelo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            bordered={false}
            title={<Space><FileTextOutlined /><span>Novi Dnevni Izvještaj</span></Space>}
            style={{ width: "100%", maxWidth: 900, margin: "0 auto", borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
            <Form form={form} layout="vertical">

                <Row gutter={24}>
                    <Col xs={24} md={16}>
                        <Form.Item name="idProjekta" label="Odabir Projekta" rules={[{ required: true }]}>
                            <Select size="large" placeholder="Pretražite projekte..." showSearch optionFilterProp="children">
                                {projekti.map(p => <Option key={p.id} value={p.id}>{p.naziv}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="datum" label="Datum Izvođenja" rules={[{ required: true }]}>
                            <DatePicker size="large" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                {pronadjeniZadaci.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <Alert
                            message={<Space><SolutionOutlined /> <strong>Pronađeni završeni zadaci</strong></Space>}
                            description={
                                <div style={{ marginTop: 10 }}>
                                    <p>Označite zadatke koje želite da prebacite u opis radova:</p>
                                    <Checkbox.Group
                                        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}
                                        onChange={(vals) => setOdabraniZadaci(vals)}
                                        value={odabraniZadaci}
                                    >
                                        {pronadjeniZadaci.map(z => (
                                            <Checkbox key={z.id} value={z.opis}>
                                                {z.opis}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<ImportOutlined />}
                                        style={{ marginTop: 12, borderRadius: 2 }}
                                        disabled={odabraniZadaci.length === 0}
                                        onClick={ubaciZadatkeUOpis}
                                    >
                                        Umetni u opis
                                    </Button>
                                </div>
                            }
                            type="info"
                            showIcon
                        />
                    </div>
                )}

                <Divider orientation="left" style={{ borderColor: "#d9d9d9" }}>Radni Sati</Divider>

                <Row gutter={16}>
                    {/*<Col span={8}>
                        <Form.Item name="ukupniSati" label="Ukupno" rules={[{ required: true }]}>
                            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
                        </Form.Item>
                    </Col>*/}
                    <Col span={8}>
                        <Form.Item name="satiRada" label="Redovni" rules={[{ required: true }]}>
                            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="prekovremeniSati" label="Prekovremeni">
                            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="nocniSati" label="Noćni Rad">
                            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="terenskiSati" label="Terenski Dodatak">
                            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="opisRadova" label="Opis Izvršenih Radova" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Unesite detaljan opis radova na gradilištu..." style={{ borderRadius: 2 }} />
                </Form.Item>

                <Divider orientation="left" style={{ borderColor: "#d9d9d9" }}>
                    <Space><BuildOutlined /> Utrošeni Materijal</Space>
                </Divider>

                {stavke.map((stavka, index) => (
                    <div
                        key={stavka._localId}
                        style={{
                            background: "#fafafa",
                            padding: "20px",
                            borderRadius: 4,
                            border: "1px solid #e8e8e8",
                            marginBottom: 20,
                            position: "relative"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                            <strong style={{ color: "#1890ff" }}>STAVKA #{index + 1}</strong>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => ukloniStavku(stavka._localId)}
                            >
                                Ukloni stavku
                            </Button>
                        </div>

                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item label="Materijal / Element" required>
                                    <Select
                                        showSearch
                                        placeholder="Odaberite materijal..."
                                        value={stavka.idMaterijala}
                                        onChange={val => updateStavka(stavka._localId, "idMaterijala", val)}
                                    >
                                        {materijali.map(m => <Option key={m.id} value={m.id}>{m.naziv}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Količina" required>
                                    <InputNumber
                                        min={0.01}
                                        style={{ width: "100%" }}
                                        value={stavka.kolicina}
                                        onChange={val => updateStavka(stavka._localId, "kolicina", val)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Etaža">
                                    <Input value={stavka.etaza} onChange={e => updateStavka(stavka._localId, "etaza", e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Pozicija" required>
                                    <Input value={stavka.pozicija} onChange={e => updateStavka(stavka._localId, "pozicija", e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Strujni krug">
                                    <Input value={stavka.strujniKrug} onChange={e => updateStavka(stavka._localId, "strujniKrug", e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Namjena">
                                    <Input value={stavka.namjena} onChange={e => updateStavka(stavka._localId, "namjena", e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Napomena">
                                    <Input value={stavka.napomena} onChange={e => updateStavka(stavka._localId, "napomena", e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                ))}

                <Button
                    type="dashed"
                    onClick={dodajStavku}
                    block
                    icon={<PlusOutlined />}
                    style={{ height: 45, marginBottom: 24, borderRadius: 4 }}
                >
                    Dodaj materijal na listu
                </Button>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
                    <Button size="large" onClick={onClose} style={{ borderRadius: 4 }}>
                        Odustani
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSubmit}
                        style={{ borderRadius: 4, paddingLeft: 40, paddingRight: 40 }}
                    >
                        Snimi Izvještaj
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default CreateDnevniIzvjestajForm;