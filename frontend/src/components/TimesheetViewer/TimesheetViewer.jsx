import React, { useState, useMemo } from 'react';
import { Table, DatePicker, Select, Statistic, Space, Tag } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HOUR_TYPES = ['Sve', 'Redovan', 'Teren', 'Noćni', 'Nedelja'];

const getTagColor = (tip) => {
    switch (tip) {
        case 'Teren': return 'blue';
        case 'Noćni': return 'purple';
        case 'Nedelja': return 'red';
        default: return 'green';
    }
};

export default function TimesheetViewer({ timesheet }) {
    const [dateRange, setDateRange] = useState(null);
    const [hourType, setHourType] = useState('Sve');

    const filteredResult = useMemo(() => {

        let data = timesheet;

        if (dateRange && dateRange.length === 2) {
            const [start, end] = dateRange;
            data = data.filter(item => {
                const itemDate = dayjs(item.datum);
                return itemDate.isAfter(start.startOf('day')) && itemDate.isBefore(end.endOf('day'));
            });
        }

        if (hourType !== 'Sve') {
            data = data.filter(item => item.tip === hourType);
        }

        const totalHours = data.reduce((sum, item) => sum + item.sati, 0);

        return { data, totalHours };
    }, [timesheet, dateRange, hourType]);

    const columns = [
        { title: 'Datum', dataIndex: 'datum', key: 'datum', render: (text) => dayjs(text).format('DD.MM.YYYY.') },
        { title: 'Projekat', dataIndex: 'projekat', key: 'projekat' },
        { title: 'Tip Sata', dataIndex: 'tip', key: 'tip', render: (tip) => <Tag color={getTagColor(tip)}>{tip}</Tag> },
        { title: 'Sati', dataIndex: 'sati', key: 'sati' },
    ];

    return (

        <div style={{ padding: '0 0' }}>


            <Space style={{ marginBottom: '16px', padding: '0 0' }}>
                <RangePicker onChange={setDateRange} style={{ width: 250 }} format="DD.MM.YYYY." />

                <Select value={hourType} onChange={setHourType} style={{ width: 150 }}>
                    {HOUR_TYPES.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>

                <Statistic
                    title="Ukupno Filtriranih Sati"
                    value={filteredResult.totalHours}
                    suffix="h"
                    valueStyle={{ fontSize: '18px' }}
                />
            </Space>

            <Table
                dataSource={filteredResult.data}
                columns={columns}
                pagination={false}
                size="small"
                rowKey={(record, index) => record.datum + index}
                locale={{ emptyText: 'Nema podataka za izabrane filtere' }}
            />
        </div>
    );
}