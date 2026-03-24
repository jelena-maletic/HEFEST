import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Card } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import './DynamicForm.css';
import { getJmb } from "../auth/auth.js";

const { Option } = Select;

const componentMap = {
    input: Input,
    password: Input.Password,
    number: InputNumber,
    date: DatePicker,
    textarea: Input.TextArea
};

const DynamicForm = ({ schema, onSubmit, onClose, initialValues }) => {
    const [form] = Form.useForm();
    const [dynamicOptions, setDynamicOptions] = useState({});

    // 1. Postavljanje inicijalnih vrijednosti i formatiranje datuma
    useEffect(() => {
        if (initialValues && schema?.fields) {
            const formattedValues = { ...initialValues };
            schema.fields.forEach(field => {
                if (field.type === 'date' && formattedValues[field.name]) {
                    formattedValues[field.name] = dayjs(formattedValues[field.name]);
                }
                // Osiguravamo da su ID-jevi stringovi radi lakšeg uparivanja u Select-u
                if (field.type === 'select' && formattedValues[field.name]) {
                    formattedValues[field.name] = String(formattedValues[field.name]);
                }
            });
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, schema, form]);

    // 2. Učitavanje nezavisnih Select opcija (oni koji imaju direktan apiEndpoint)
    useEffect(() => {
        if (!schema?.fields) return;

        schema.fields.forEach((field) => {
            if (field.type === "select" && field.apiEndpoint) {
                let finalUrl = field.apiEndpoint;

                if (typeof finalUrl === 'string' && finalUrl.includes(":jmb")) {
                    const trenutniJmb = getJmb();
                    if (!trenutniJmb) return;
                    finalUrl = finalUrl.replace(":jmb", trenutniJmb);
                }

                axios.get(finalUrl)
                    .then((res) => {
                        setDynamicOptions((prev) => ({
                            ...prev,
                            [field.name]: Array.isArray(res.data) ? res.data : [],
                        }));
                    })
                    .catch((err) => console.error(`Greška: ${field.name}`, err));
            }
        });
    }, [schema]);

    // Prati promjenu resourceType polja
    const resourceType = Form.useWatch('resourceType', form);

    // 3. Učitavanje ZAVISNIH opcija (Vozila, Oprema, Materijal)
    useEffect(() => {
        const dependentField = schema?.fields?.find(f => f.dependsOn === 'resourceType');

        if (dependentField && resourceType && dependentField.endpoints) {
            const url = dependentField.endpoints[resourceType];

            axios.get(url)
                .then(res => {
                    const options = Array.isArray(res.data) ? res.data : [];
                    setDynamicOptions(prev => ({
                        ...prev,
                        [dependentField.name]: options
                    }));

                    // FIX: Ako editujemo postojeći zapis, ne smijemo pregaziti vrijednost sa undefined
                    // Vraćamo vrijednost iz initialValues ako postoji, inače resetujemo
                    if (initialValues && initialValues[dependentField.name]) {
                        form.setFieldValue(dependentField.name, String(initialValues[dependentField.name]));
                    } else if (!initialValues) {
                        // Samo ako je kreiranje novog, resetuj polje pri promjeni tipa
                        form.setFieldValue(dependentField.name, undefined);
                    }
                })
                .catch(err => console.error("Greška pri učitavanju zavisnih opcija", err));
        }
    }, [resourceType, schema?.fields, form, initialValues]);

    if (!schema || !schema.fields) return null;

    const renderField = (field) => {
        if (field.type === "select") {
            const options = field.options || dynamicOptions[field.name] || [];
            return (
                <Select mode={field.mode} placeholder={field.placeholder} allowClear showSearch optionFilterProp="children">
                    {options.map((option, index) => {
                        const label = option.label ||
                            `${option[field.optionLabel] || option.ime || option.naziv || ''} ${option.prezime || ''}`.trim() ||
                            `Opcija ${index}`;

                        // Forsiramo String nad vrijednošću da se poklopi sa formom
                        const rawValue = field.optionValue && option[field.optionValue] !== undefined
                            ? option[field.optionValue]
                            : option.value !== undefined ? option.value : (option.jmb ?? option.id ?? index);

                        const value = String(rawValue);

                        return <Option key={value} value={value}>{label}</Option>;
                    })}
                </Select>
            );
        }
        if (field.type === "password") return <Input.Password placeholder={field.placeholder} />;
        if (field.type === "date") return <DatePicker style={{ width: "100%" }} />;
        if (field.type === "number") return <InputNumber style={{ width: "100%" }} min={field.min} />;

        const Component = componentMap[field.type] || Input;
        return <Component placeholder={field.placeholder} style={{ width: "100%" }} />;
    };

    return (
        <Card className="dynamic-form-card" title={initialValues ? `Uredi: ${schema.title}` : schema.title} style={{ marginTop: '20px' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onSubmit(values);
                    form.resetFields();
                    onClose?.();
                }}
            >
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.resourceType !== curr.resourceType}>
                    {() => (
                        <>
                            {schema.fields.map((field) => {
                                // Sakrij zavisno polje ako "roditelj" nije odabran
                                if (field.dependsOn && !form.getFieldValue(field.dependsOn)) {
                                    return null;
                                }

                                const schemaRules = field.rules || [];

                                // Dodajemo required rule na početak niza ako je polje označeno kao obavezno
                                const finalRules = [
                                    { required: field.required, message: field.requiredMessage || "Obavezno polje" },
                                    ...schemaRules
                                ];

                                return (
                                    <Form.Item
                                        key={field.name}
                                        name={field.name}
                                        label={field.label}
                                        rules={finalRules}
                                    >
                                        {renderField(field)}
                                    </Form.Item>
                                );
                            })}
                        </>
                    )}
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>Odustani</Button>
                    <Button type="primary" htmlType="submit">
                        {schema.submitLabel || "Sačuvaj"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DynamicForm;