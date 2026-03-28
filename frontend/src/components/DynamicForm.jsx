import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Card } from "antd";
import dayjs from "dayjs";
import './DynamicForm.css';
import { getJmb } from "../auth/auth.js";
import api from "../auth/axiosInstance.js"; // OSIGURAJ DA JE PUTANJA TAČNA

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

    // 1. Postavljanje inicijalnih vrijednosti i formatiranje podataka
    useEffect(() => {
        if (initialValues && schema?.fields) {
            const formattedValues = { ...initialValues };
            schema.fields.forEach(field => {
                // Formatiranje datuma za DatePicker
                if (field.type === 'date' && formattedValues[field.name]) {
                    formattedValues[field.name] = dayjs(formattedValues[field.name]);
                }

                // Rješavanje "value should be array" warninga za multiple select
                if (field.type === 'select' && field.mode === 'multiple') {
                    formattedValues[field.name] = Array.isArray(formattedValues[field.name])
                        ? formattedValues[field.name].map(val => String(val))
                        : [];
                }
                // Pretvaranje običnog selecta u string radi lakšeg uparivanja
                else if (field.type === 'select' && formattedValues[field.name] !== undefined && formattedValues[field.name] !== null) {
                    formattedValues[field.name] = String(formattedValues[field.name]);
                }
            });
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, schema, form]);

    // 2. Učitavanje nezavisnih Select opcija koristeći AUTHORIZED api.service
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

                // Koristimo api.service da izbjegnemo 403 Forbidden
                api.service(false).get(finalUrl)
                    .then((res) => {
                        setDynamicOptions((prev) => ({
                            ...prev,
                            [field.name]: Array.isArray(res.data) ? res.data : [],
                        }));
                    })
                    .catch((err) => console.error(`Greška pri učitavanju opcija za: ${field.name}`, err));
            }
        });
    }, [schema]);

    const resourceType = Form.useWatch('resourceType', form);

    // 3. Učitavanje ZAVISNIH opcija (Vozila, Oprema, Materijal)
    useEffect(() => {
        const dependentField = schema?.fields?.find(f => f.dependsOn === 'resourceType');

        if (dependentField && resourceType && dependentField.endpoints) {
            const url = dependentField.endpoints[resourceType];

            api.service(false).get(url)
                .then(res => {
                    const options = Array.isArray(res.data) ? res.data : [];
                    setDynamicOptions(prev => ({
                        ...prev,
                        [dependentField.name]: options
                    }));

                    if (initialValues && initialValues[dependentField.name]) {
                        form.setFieldValue(dependentField.name, String(initialValues[dependentField.name]));
                    } else if (!initialValues) {
                        form.setFieldValue(dependentField.name, undefined);
                    }
                })
                .catch(err => console.error("Greška pri učitavanju zavisnih opcija", err));
        }
    }, [resourceType, schema?.fields, form, initialValues]);

    if (!schema || !schema.fields) return null;

    const renderField = (field) => {
        if (field.type === "select") {
            const options = dynamicOptions[field.name] || field.options || [];

            return (
                <Select
                    mode={field.mode}
                    placeholder={field.placeholder}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                >
                    {options.map((option, index) => {
                        let label = "";
                        if (option.ime && option.prezime) {
                            label = `${option.ime} ${option.prezime}`;
                        } else if (option.naziv) {
                            label = option.naziv;
                        } else if (field.optionLabel && option[field.optionLabel]) {
                            label = option[field.optionLabel];
                        } else {
                            label = option.label || `Opcija ${index}`;
                        }

                        const rawValue = option.jmb || option.id || option.value || index;
                        const value = String(rawValue);

                        return (
                            <Option key={value} value={value}>
                                {label}
                            </Option>
                        );
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
                    // Konverzija dayjs objekata u ISO stringove pre slanja na backend
                    const cleanedValues = { ...values };
                    schema.fields.forEach(f => {
                        if (f.type === 'date' && cleanedValues[f.name]) {
                            cleanedValues[f.name] = cleanedValues[f.name].toISOString();
                        }
                    });

                    onSubmit(cleanedValues);
                    form.resetFields();
                    onClose?.();
                }}
            >
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.resourceType !== curr.resourceType}>
                    {() => (
                        <>
                            {schema.fields.map((field) => {
                                if (field.dependsOn && !form.getFieldValue(field.dependsOn)) {
                                    return null;
                                }

                                const finalRules = [
                                    { required: field.required, message: field.requiredMessage || "Obavezno polje" },
                                    ...(field.rules || [])
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