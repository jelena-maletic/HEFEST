import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Card } from "antd";
import axios from "axios";

const { Option } = Select;

// Mapa koja povezuje stringove iz tvoje šeme sa Ant Design komponentama
const componentMap = {
    input: Input,
    number: InputNumber,
    date: DatePicker,
    textarea: Input.TextArea
};

const DynamicForm = ({ schema, onSubmit, onClose }) => {
    // 1. Hook-ovi MORAJU biti na samom vrhu, bez ikakvih if-ova iznad njih
    console.log("SCHEMA:", schema);
    const [form] = Form.useForm();
    const [dynamicOptions, setDynamicOptions] = useState({});

    useEffect(() => {
        // Ako šema nema polja, nemoj raditi ništa
        if (!schema || !schema.fields) return;

        schema.fields.forEach((field) => {
            if (field.type === "select" && field.apiEndpoint) {
                axios.get(field.apiEndpoint)
                    .then((res) => {
                        setDynamicOptions((prev) => ({
                            ...prev,
                            [field.name]: res.data,
                        }));
                    })
                    .catch((err) => {
                        console.error(`Greška pri učitavanju opcija za ${field.name}:`, err);
                    });
            }
        });
    }, [schema]);

    // 2. Uslovni render: Ako šema ne postoji, renderuj null (ali nakon što su hook-ovi inicijalizovani)
    if (!schema || !schema.fields) {
        return null;
    }

    const renderField = (field) => {
        if (field.type === "select") {
            // Opcije iz šeme (statičke) ili iz API-ja (dinamičke)
            const options = field.options || dynamicOptions[field.name] || [];

            return (
                <Select
                    mode={field.mode}
                    placeholder={field.placeholder}
                    allowClear
                >
                    {options.map((option, index) => {
                        // Prilagođeno tvom API-ju (ime + prezime ili label)
                        const label = option.label || `${option.ime || ''} ${option.prezime || ''}`.trim() || `Opcija ${index}`;
                        const value = option.value !== undefined ? option.value : (option.id ?? index);

                        return (
                            <Option key={value} value={value}>
                                {label}
                            </Option>
                        );
                    })}
                </Select>
            );
        }

        // Uzmi komponentu iz mape ili koristi običan Input kao fallback
        const Component = componentMap[field.type] || Input;
        return <Component placeholder={field.placeholder} style={{ width: "100%" }} />;
    };

    return (
        <Card title={schema.title || "Unos podataka"} style={{ marginTop: '20px', width: '100%' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onSubmit(values);
                    form.resetFields(); // Opciono: očisti formu nakon slanja
                    onClose?.();
                }}
            >
                {schema.fields.map((field) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        rules={[
                            {
                                required: field.required,
                                message: field.requiredMessage || `${field.label} je obavezno polje`
                            },
                            ...(field.rules || [])
                        ]}
                    >
                        {renderField(field)}
                    </Form.Item>
                ))}

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>
                        Odustani
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {schema.submitLabel || "Sačuvaj"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DynamicForm;