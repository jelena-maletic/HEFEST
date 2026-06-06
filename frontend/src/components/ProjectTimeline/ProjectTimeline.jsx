import React from 'react';
import dayjs from 'dayjs';
import { Progress, Tooltip } from 'antd';
import './ProjectTimeline.css';

export default function ProjectTimeline({ pocetakRada, rok }) {
    if (!pocetakRada || !rok) {
        return <div className="project-timeline-container">Nema definisanog roka.</div>;
    }

    const start = dayjs(pocetakRada);
    const end = dayjs(rok);
    const now = dayjs();

    const totalDuration = end.diff(start, 'day');
    const elapsedDuration = now.diff(start, 'day');
    const daysRemaining = end.diff(now, 'day');

    let percentage = 0;
    if (totalDuration > 0) {
        percentage = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
    }

    let statusColor = '#52c41a';
    let statusText = `${daysRemaining} dana preostalo do roka`;

    if (daysRemaining < 0) {
        statusColor = '#f5222d';
        statusText = `Rok istekao prije ${Math.abs(daysRemaining)} dana`;
        percentage = 100;
    } else if (daysRemaining <= 30) {
        statusColor = '#f5222d';
    } else if (percentage < 30) {
        statusColor = '#faad14';
        statusText = 'Projekat je u početnoj fazi';
    } else {
        statusColor = '#52c41a';
    }

    const title = `Projekat: ${start.format('DD.MM.YYYY.')} - ${end.format('DD.MM.YYYY.')}`;

    return (
        <div className="project-timeline-container">
            <h4>Vremenska traka projekta</h4>
            <Tooltip title={title}>
                <Progress
                    percent={Math.round(percentage)}
                    status={daysRemaining < 0 ? 'exception' : 'active'}
                    strokeColor={statusColor}
                    format={(percent) => `${Math.round(percent)}% Vremena prošlo`}
                />
            </Tooltip>
            <div className="timeline-info" style={{ color: statusColor }}>
                {statusText}
            </div>
        </div>
    );
}