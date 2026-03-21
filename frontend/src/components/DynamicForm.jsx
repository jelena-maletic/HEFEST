import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Card } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const componentMap = {
    input: Input,
    password: Input.Password,
    number: InputNumber,
    date: DatePicker,
    textarea: Input.TextArea
};

const DynamicForm = ({ schema, onSubmit, onClose, initialValues}) => {
    console.log("SCHEMA:", schema);
    const [form] = Form.useForm();
    const [dynamicOptions, setDynamicOptions] = useState({});

    useEffect(() => {
        if (initialValues && schema.fields) {
            const formattedValues = { ...initialValues };

            schema.fields.forEach(field => {
                if (field.type === 'date' && formattedValues[field.name]) {
                    formattedValues[field.name] = dayjs(formattedValues[field.name]);
                }
            });

            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, schema.fields, form]);

    useEffect(() => {
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

    if (!schema || !schema.fields) {
        return null;
    }

    const renderField = (field) => {
        if (field.type === "select") {
            const options = field.options || dynamicOptions[field.name] || [];

            return (
                <Select
                    mode={field.mode}
                    placeholder={field.placeholder}
                    allowClear
                >
                    {options.map((option, index) => {

                        //const label = option.label || `${option.ime || ''} ${option.prezime || ''}`.trim() || `Opcija ${index}`;
                        const label = option.label ||
                            `${option[field.optionLabel] || option.ime || ''} ${option.prezime || ''}`.trim() ||
                            `Opcija ${index}`;
                        /*const value = option[field.optionValue] !== undefined
                            ? option[field.optionValue]
                            : (option.jmb ?? option.id ?? index);*/
                        const value = field.optionValue && option[field.optionValue] !== undefined
                            ? option[field.optionValue]
                            : option.value !== undefined
                                ? option.value
                                : (option.jmb ?? option.id ?? index);

                        return (
                            <Option key={value} value={value}>
                                {label}
                            </Option>
                        );
                    })}
                </Select>
            );
        }

        if (field.type === "password") {
            return (
                <Input.Password
                    placeholder={field.placeholder}
                    visibilityToggle={true}
                />
            );
        }

        if (field.type === "date") {
            return (
                <DatePicker
                    style={{ width: "100%" }}
                />
            );
        }

        const Component = componentMap[field.type] || Input;
        return <Component placeholder={field.placeholder} style={{ width: "100%" }} />;
    };

    return (
        <Card title={initialValues ? `Uredi: ${schema.title}` : schema.title} style={{ marginTop: '20px', width: '100%' }}>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={(values) => {
                    onSubmit(values);
                    form.resetFields();
                    onClose?.();
                }}
            >
                {schema.fields.map((field) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        {...(field.type === "date" ? {
                            getValueProps: (value) => ({
                                value: value ? dayjs(value) : null,
                            })
                        } : {})}
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