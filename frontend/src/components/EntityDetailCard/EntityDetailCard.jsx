import React from 'react';
import { Card, Descriptions, Button, Space, Empty, Spin } from 'antd';
import { InfoCircleOutlined, ToolOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProjectTimeline from '../ProjectTimeline/ProjectTimeline.jsx';
import './EntityDetailCard.css';
import projectIcon from '../../assets/projects.svg';

const ProjectIcon = () => (
    <img src={projectIcon} alt="Project"  className="card-title-icon" style={{ width: '24px', marginRight: '8px' }} />
);
const IconMap = {
    PROJECT: ProjectIcon,
    EMPLOYEE: TeamOutlined,
    TECHNICIAN: ToolOutlined,
    REPORT: InfoCircleOutlined,
    DEFAULT: InfoCircleOutlined
};

const EntityDetailCard = ({
                              entityTitle,
                              items = [],
                              entityType,
                              rawData,
                              isProject = false,
                              loading = false,
                              userRole,
                              onEdit,
                              onDelete,
                          }) => {
    const IconComponent = IconMap[entityType] || IconMap.DEFAULT;
    const showTimeline = isProject;
    const canPerformActions =
        userRole?.toLowerCase() === 'direktor' &&
        entityType === 'PROJECT';

    if (loading) {
        return (
            <Card className="entity-detail-card no-border">
            <Spin tip="Učitavanje detalja..." size="large">

                    <div style={{ height: 300 }} />
                </Spin>
            </Card>
        );
    }


    const extraActions = (
        <Space className="card-actions">
            {canPerformActions && onEdit && <Button icon={<EditOutlined />} onClick={onEdit}>Uredi</Button>}
            {canPerformActions && onDelete && <Button danger icon={<DeleteOutlined />} onClick={onDelete}>Obriši</Button>}
        </Space>
    );

    return (
        <Card
            className="entity-detail-card"
            title={
                <div className="card-title-content">
                    <IconComponent className="card-title-icon" />
                    <span className="card-title-text">{entityTitle}</span>
                </div>
            }
            extra={extraActions}
        >

            {items && items.length > 0 ? (
                <>

                    {items.map((section, sectionIndex) => (
                        <div key={section.title} className="entity-detail-section">


                            <h4 className="section-title">{section.title}</h4>


                            <Descriptions
                                column={{ xs: 1, sm: 2, lg: 3 }}
                                layout="vertical"
                                bordered={false}
                            >

                                {section.items.map(item => (
                                    <Descriptions.Item label={item.label} key={item.key} span={item.span || 1}>
                                        {item.render ? item.render(item.value) : <span>{item.value || 'N/A'}</span>}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>


                            {sectionIndex < items.length - 1 && (
                                <hr className="section-divider" />
                            )}
                        </div>
                    ))}


                    {showTimeline && rawData?.pocetakRada && rawData?.rok && (
                        <ProjectTimeline
                            pocetakRada={rawData.pocetakRada}
                            rok={rawData.rok}
                        />
                    )}
                </>
            ) : (
                <Empty description={`Nema dostupnih podataka za ${entityTitle.toLowerCase()} (ili niste ovlašćeni za pregled)`} />
            )}
        </Card>
    );
};


export default EntityDetailCard;