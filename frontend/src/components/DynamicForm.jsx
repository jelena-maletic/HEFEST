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

    const formatFieldValue = (field, rawValue) => {
        if (!rawValue) return field.mode === 'multiple' ? [] : undefined;

        if (field.type === 'date') return dayjs(rawValue);

        if (field.type === 'select') {
            if (field.mode === 'multiple') {
                const arrayVal = Array.isArray(rawValue) ? rawValue : String(rawValue).split(',').map(s => s.trim());
                return arrayVal.map(val => String(val));
            }
            return String(rawValue);
        }
        return rawValue;
    };

    useEffect(() => {
        if (initialValues && schema?.fields) {
            const formattedValues = { ...initialValues };

            schema.fields.forEach(field => {
                if (field.name.endsWith('Jmb')) {
                    const objectName = field.name.replace('Jmb', '');
                    if (formattedValues[objectName]?.jmb) {
                        formattedValues[field.name] = String(formattedValues[objectName].jmb);
                    }
                }

                formattedValues[field.name] = formatFieldValue(field, formattedValues[field.name]);
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
                const handleDataLoad = (data) => {
                    setDynamicOptions((prev) => ({ ...prev, [field.name]: data }));

                    if (initialValues) {
                        let rawVal = initialValues[field.name];

                        if (!rawVal && field.name === 'magacionerJmb') {
                            rawVal = initialValues.magacioner?.jmb;
                        }

                        if (rawVal) {
                            form.setFieldValue(field.name, formatFieldValue(field, rawVal));
                        }
                    }
                };

                if (field.apiEndpoint) {
                    let finalUrl = field.apiEndpoint;
                    if (typeof finalUrl === 'string' && finalUrl.includes(":jmb")) {
                        const trenutniJmb = getJmb();
                        if (trenutniJmb) finalUrl = finalUrl.replace(":jmb", trenutniJmb);
                    }

                    api.service(false).get(finalUrl)
                        .then(res => handleDataLoad(Array.isArray(res.data) ? res.data : []))
                        .catch(err => console.error(`Greška: ${field.name}`, err));
                } else if (field.optionsTag) {
                    fetchData(field.optionsTag)
                        .then(data => handleDataLoad(data))
                        .catch(err => console.error(`Greška: ${field.optionsTag}`, err));
                }
            }
        });
    }, [schema, initialValues, form]);

    const resourceType = Form.useWatch('resourceType', form);

    const pocetakRada = Form.useWatch('pocetakRada', form);
    const krajRada = Form.useWatch('krajRada', form);

    useEffect(() => {
        if (schema.title === "Podaci o projektu") {
            const danas = dayjs();
            let noviStatus = form.getFieldValue('status');
            let shouldDisable = false;

            if (pocetakRada && dayjs(pocetakRada).isAfter(danas, 'day')) {
                noviStatus = "DOGOVOREN";
                shouldDisable = true;
            } else if (krajRada && dayjs(krajRada).isBefore(danas, 'day')) {
                noviStatus = "ZAVRŠEN";
                shouldDisable = true;
            } else {
                const trenutni = form.getFieldValue('status');
                if (trenutni === "DOGOVOREN" || trenutni === "ZAVRŠEN" || !trenutni) {
                    form.setFieldsValue({ status: "AKTIVAN" });
                }
                setIsStatusDisabled(false);
            }

            form.setFieldsValue({ status: noviStatus });
            setIsStatusDisabled(shouldDisable);
        }
    }, [pocetakRada, krajRada, form, schema.title]);

    const [isStatusDisabled, setIsStatusDisabled] = useState(false);

    useEffect(() => {
        const dependentField = schema?.fields?.find(f => f.dependsOn === 'resourceType');
        if (dependentField && resourceType && dependentField.endpoints) {
            const url = dependentField.endpoints[resourceType];
            api.service(false).get(url)
                .then(res => {
                    const options = Array.isArray(res.data) ? res.data : [];
                    setDynamicOptions(prev => ({ ...prev, [dependentField.name]: options }));

                    if (initialValues?.[dependentField.name]) {
                        form.setFieldValue(dependentField.name, formatFieldValue(dependentField, initialValues[dependentField.name]));
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
            let options = dynamicOptions[field.name] || field.options || [];

            const disabled = field.name === "status" && isStatusDisabled;

            if (field.name === "status" && !isStatusDisabled) {
                options = options.filter(opt =>
                    opt.value === "AKTIVAN" || opt.value === "NEAKTIVAN"
                );
            }

            return (
                <Select
                    mode={field.mode}
                    placeholder={field.placeholder}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    disabled={disabled}
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

                        const rawValue = field.optionValue
                            ? (option[field.optionValue] ?? option.id ?? index)
                            : (option.value ?? option.jmb ?? option.id ?? index);

                        return (
                            <Option key={String(rawValue)} value={String(rawValue)}>
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
                {schema.fields.map((field) => {
                    if (field.dependsOn && !form.getFieldValue(field.dependsOn)) return null;

                    return (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            rules={[{ required: field.required, message: field.requiredMessage || "Obavezno polje" }, ...(field.rules || [])]}
                        >
                            {renderField(field)}
                        </Form.Item>
                    );
                })}

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