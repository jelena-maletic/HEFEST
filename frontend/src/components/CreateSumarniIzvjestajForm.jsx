import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, InputNumber, Input, Button, Card, Divider, Row, Col, Space, Alert, Checkbox } from "antd";
import { CalculatorOutlined, FileDoneOutlined, HistoryOutlined } from "@ant-design/icons";
import api from "../auth/axiosInstance.js";
import { useNotification } from "./NotificationContext.jsx";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CreateSumarniIzvjestajForm = ({ onClose, onSuccess }) => {
    const jmb = sessionStorage.getItem('jmb');
    const [form] = Form.useForm();
    const [projekti, setProjekti] = useState([]);
    const [dnevniIzvjestaji, setDnevniIzvjestaji] = useState([]);
    const [loading, setLoading] = useState(false);
    const notify = useNotification();

    const idProjekta = Form.useWatch('idProjekta', form);
    const period = Form.useWatch('period', form);

    useEffect(() => {
        api.service(true).get(`http://localhost:8080/api/projekti/poslovodja/${jmb}`)
            .then(res => setProjekti(res.data || []))
            .catch(() => notify.error("Greška", "Učitavanje projekata nije uspjelo."));
    }, []);

    useEffect(() => {
        if (idProjekta && period && period[0] && period[1]) {
            const od = period[0].format("YYYY-MM-DD");
            const doDatuma = period[1].format("YYYY-MM-DD");

            api.service(true).get(`http://localhost:8080/api/dnevni_izvjestaji/projekat/${idProjekta}?od=${od}&do=${doDatuma}`)
                .then(res => setDnevniIzvjestaji(res.data || []))
                .catch(() => setDnevniIzvjestaji([]));
        }
    }, [idProjekta, period]);

    const generisiPodatke = () => {
        if (dnevniIzvjestaji.length === 0) return;

        let ukupnoSati = 0;
        let generisaniOpis = "";

        dnevniIzvjestaji.forEach(izv => {
            ukupnoSati += (izv.ukupniSati || 0);

            const radnik = izv.tehnicar ? `${izv.tehnicar.ime} ${izv.tehnicar.prezime}` : "Tehničar";
            generisaniOpis += `• [${izv.datum}] ${radnik}: ${izv.opisRadova}\n`;
        });

        form.setFieldsValue({
            ukupniSatiRada: ukupnoSati,
            opis: generisaniOpis
        });

        notify.success("Obrađeno", `Analizirano ${dnevniIzvjestaji.length} dnevnih izvještaja.`);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const payload = {
                idProjekta: values.idProjekta,
                pocetniDatum: values.period[0].format("YYYY-MM-DD"),
                krajnjiDatum: values.period[1].format("YYYY-MM-DD"),
                ukupniSatiRada: values.ukupniSatiRada,
                opis: values.opis,
                jmbPoslovodja: sessionStorage.getItem('jmb'),
                stavkeIds: dnevniIzvjestaji.map(izv => izv.idIzvjestaja || izv.id)
            };

            await api.service(true).post("http://localhost:8080/api/sumarni_izvjestaji", payload);
            notify.success("Uspješno", "Sumarni izvještaj je kreiran.");
            onSuccess();
        } catch (err) {
            notify.error("Greška", "Slanje izvještaja nije uspjelo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={<Space><FileDoneOutlined /> Kreiranje sumarnog izvještaja</Space>} bordered={false}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="idProjekta" label="Projekat" rules={[{ required: true }]}>
                            <Select placeholder="Odaberite projekat">
                                {projekti.map(p => <Select.Option key={p.id} value={p.id}>{p.naziv}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="period" label="Period (Od - Do)" rules={[{ required: true }]}>
                            <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {dnevniIzvjestaji.length > 0 ? (
                    <Alert
                        style={{ marginBottom: 20 }}
                        message={`Pronađeno ${dnevniIzvjestaji.length} dnevnih izvještaja za odabrani kriterijum.`}
                        type="info"
                        showIcon
                        action={
                            <Button size="small" type="primary" icon={<CalculatorOutlined />} onClick={generisiPodatke}>
                                Izračunaj i generiši opis
                            </Button>
                        }
                    />
                ) : (
                    idProjekta && <Alert message="Nema pronađenih dnevnih izvještaja za ovaj period." type="warning" showIcon style={{ marginBottom: 20 }} />
                )}

                <Form.Item name="ukupniSatiRada" label="Ukupni radni sati za period" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Automatski se računa..." />
                </Form.Item>

                <Form.Item name="opis" label="Zaključak i zbirni opis radova" rules={[{ required: true }]}>
                    <TextArea rows={10} placeholder="Sistem će ovdje spojiti sve opise dnevnih radova tehničara..." />
                </Form.Item>

                <div style={{ textAlign: 'right', gap: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose}>Odustani</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>Kreiraj sumarni izvještaj</Button>
                </div>
            </Form>
        </Card>
    );
};

export default CreateSumarniIzvjestajForm;