import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber, Card } from "antd";
import dayjs from "dayjs";
import './DynamicForm.css';
import { getJmb } from "../auth/auth.js";
import api from "../auth/axiosInstance.js";
import LocationPicker from "../components/LocationPicker/LocationPicker.jsx";
const { Option } = Select;
import { fetchData } from "../services/apiHelpers.js";

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


    useEffect(() => {
        if (initialValues && schema?.fields) {
            const formattedValues = { ...initialValues };

            schema.fields.forEach(field => {
                // POPRAVKA ZA EDIT: Ako polje u šemi traži JMB (npr. magacionerJmb)
                // a u podacima imamo objekat (npr. magacioner: { jmb: "..." })
                if (field.name.endsWith('Jmb')) {
                    const objectName = field.name.replace('Jmb', '');
                    if (formattedValues[objectName] && formattedValues[objectName].jmb) {
                        formattedValues[field.name] = String(formattedValues[objectName].jmb);
                    }
                }

                if (field.type === 'date' && formattedValues[field.name]) {
                    formattedValues[field.name] = dayjs(formattedValues[field.name]);
                }

                if (field.type === 'select') {
                    if (field.mode === 'multiple') {
                        formattedValues[field.name] = Array.isArray(formattedValues[field.name])
                            ? formattedValues[field.name].map(val => String(val))
                            : [];
                    } else if (formattedValues[field.name] !== undefined && formattedValues[field.name] !== null) {
                        formattedValues[field.name] = String(formattedValues[field.name]);
                    }
                }
            });
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, schema, form]);


    useEffect(() => {
        if (!schema?.fields) return;

        schema.fields.forEach((field) => {
            if (field.type === "select") {

                // --- CASE 1: Polje koristi direktan apiEndpoint (npr. tehničari) ---
                if (field.apiEndpoint) {
                    let finalUrl = field.apiEndpoint;

                    if (typeof finalUrl === 'string' && finalUrl.includes(":jmb")) {
                        const trenutniJmb = getJmb();
                        if (!trenutniJmb) return;
                        finalUrl = finalUrl.replace(":jmb", trenutniJmb);
                    }

                    api.service(false).get(finalUrl)
                        .then((res) => {
                            const data = Array.isArray(res.data) ? res.data : [];
                            setDynamicOptions((prev) => ({
                                ...prev,
                                [field.name]: data,
                            }));

                            // Popravka za edit: postavi vrijednost nakon što stignu podaci
                            if (initialValues && initialValues[field.name]) {
                                form.setFieldValue(field.name, String(initialValues[field.name]));
                            }
                        })
                        .catch((err) => console.error(`Greška pri učitavanju opcija za: ${field.name}`, err));
                }

                // --- CASE 2: Polje koristi optionsTag (npr. magacioneri kroz apiHelpers) ---
                else if (field.optionsTag) {
                    fetchData(field.optionsTag)
                        .then((data) => {
                            setDynamicOptions((prev) => ({
                                ...prev,
                                [field.name]: data,
                            }));

                            // Popravka za edit: postavi vrijednost nakon što stignu podaci
                            if (initialValues && initialValues[field.name]) {
                                // Provjera ako je u pitanju magacionerJmb, a backend poslao objekat 'magacioner'
                                const val = initialValues[field.name] || initialValues.magacioner?.jmb;
                                if (val) {
                                    form.setFieldValue(field.name, String(val));
                                }
                            }
                        })
                        .catch((err) => console.error(`Greška pri učitavanju tag-a: ${field.optionsTag}`, err));
                }
            }
        });
    }, [schema, initialValues, form]);

    const resourceType = Form.useWatch('resourceType', form);


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

        if (field.type === "location") {
            return (
                <LocationPicker
                    initialValue={form.getFieldValue(field.name)}
                    onLocationSelected={(coords) => {
                        form.setFieldsValue({ [field.name]: coords });
                    }}
                />
            );
        }


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