import {useState} from "react";
import { Select } from 'antd';
import './Dashboard.css';
import MapView from "../../components/MapView.jsx";
import Calendar from "../../components/Calendar.jsx";
import hefestLogo from '../../assets/hefest-logo.svg';
import {TopBar} from "../../components/TopBar.jsx"
import {Sidebar} from "../../components/Sidebar.jsx";
import { List } from "../../components/List/List.jsx";
import CenteredOverlay from "../../components/CenteredOverlay/CenteredOverlay.jsx";
import EntityDetailCard from "../../components/EntityDetailCard/EntityDetailCard.jsx";
import { formatEntityDetails } from "../../utils/entityDetailFormatter.js";


export function Dashboard({sidebarContents, role}) {
    const [isActive, setIsActive] = useState(false);
    const [activeScreen, setActiveScreen] = useState("home");
    const [screenTitle, setScreenTitle] = useState("home");



    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [rawEntityData, setRawEntityData] = useState(null);
    const [entityType, setEntityType] = useState("");

    const TAG_MAP = {
        "projekti": "PROJECT",
        "zaposleni": "EMPLOYEE",
        "tehnicari": "EMPLOYEE", // Koristimo isti maper za sve tipove zaposlenih
        "poslovodje": "EMPLOYEE",
        "magacioneri": "EMPLOYEE",
        "knjigovodje": "EMPLOYEE",
        "tehnicari/only": "EMPLOYEE",
        "vozila": "VEHICLE",
        "radna-oprema": "TOOL",
        "materijal": "MATERIAL",
        "dnevni_izvjestaji": "REPORT"
    };
    /*const handleOpenDetails = (rawData, tag) => {
        const type = TAG_MAP[tag];
        if (!type) return;

        const formatted = formatEntityDetails(rawData, type, role);

        setDetailData(formatted.items);
        setRawEntityData(rawData);
        setEntityType(type);
        setIsDetailVisible(true);
    };*/
    const handleOpenDetails = async (rawData, tag) => {
        const type = TAG_MAP[tag];
        if (!type) return;

        try {
            // 2. Dodajemo 'await' jer je formatEntityDetails postao asinhron (vraća Promise)
            const formatted = await formatEntityDetails(rawData, type, role);

            setDetailData(formatted.items);
            setRawEntityData(rawData);
            setEntityType(type);
            setIsDetailVisible(true);
        } catch (error) {
            console.error("Greška pri formatiranju detalja:", error);
            // Opciono: dodaj notification.error ako želiš obavijestiti korisnika
        }
    };

    const handleCloseDetails = () => {
        setIsDetailVisible(false);
        setDetailData(null);
    };

    const handleEdit = () => {
        console.log("Otvaram formu za uređivanje:", rawEntityData);
        // Ovdje ćeš kasnije dodati navigaciju na formu ili novi modal
    };


    const toggleStatus = () => setIsActive(!isActive);

    const handleScreen = (activeScreen, screenTitle) => {
        setActiveScreen(activeScreen);
        setScreenTitle(screenTitle);
        console.log(activeScreen, screenTitle);
    };

    // Unutar Dashboard komponente
    const [selectedEmployeeTag, setSelectedEmployeeTag] = useState("zaposleni");

// Opcije koje odgovaraju tvojim endpointima/tagovima u apiHelper-u
    const employeeOptions = [
        { value: "zaposleni", label: "Svi zaposleni" },
        { value: "knjigovodje", label: "Knjigovođe" },
        { value: "poslovodje", label: "Poslovođe" },
        { value: "magacioneri", label: "Magacioneri" },
        { value: "tehnicari", label: "Tehničari" }
    ];

    return (
        <div className="app-container">

            <TopBar activeScreen={activeScreen} screenTitle={screenTitle} screenHandle={handleScreen} role={role}/>

            <div className="content-area">

                <Sidebar contents={sidebarContents[role]} screenHandle={handleScreen}
                         activeHandle={toggleStatus} active={isActive} />

                <main className={`home-screen ${activeScreen !== "home" ? "content-active" : ""}`}
                      style={{
                          backgroundImage: activeScreen === "home" ? `url(${hefestLogo})` : "none"
                      }}
                >

                    {activeScreen === "map" && <MapView />}
                    {activeScreen === "calendar" && <Calendar/>}
                    {/*{activeScreen === "employees" && <List isEditable={false} listTitle={screenTitle} screenState="user" tag="zaposleni" />}*/}
                    {activeScreen === "report-overview" && <div className={"report-lists"}>
                                                                <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="dnevni_izvjestaji" />
                                                                <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                                                            </div>}
                    {activeScreen === "tools" && <List isEditable={true} listTitle={screenTitle} screenState="tools" tag="radna-oprema" />}
                    {activeScreen === "vehicles" && <List isEditable={true} listTitle={screenTitle} screenState="truck" tag="vozila" />}
                    {activeScreen === "materials" && <List isEditable={true} listTitle={screenTitle} screenState="material" tag="materijal" />}
                    {activeScreen === "taken-resources" && <List isEditable={true} listTitle={screenTitle} screenState="taken-resources" tag="zaduzenja" />}
                    {activeScreen === "request-overview" && <List isEditable={false} listTitle={screenTitle} screenState="request-overview" tag="zahtjevi" />}
                    {activeScreen === "technicians" && (
                        <List
                            isEditable={false}
                            listTitle={screenTitle}
                            screenState="user"
                            tag="tehnicari/only"
                            onClick={(data) => handleOpenDetails(data, "tehnicari")} // DODAJ OVO
                        />
                    )}
                    {activeScreen === "report-overview-manager" && <div className={"report-lists"}>
                                                                <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="dnevni_izvjestaji" />
                                                                 <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                                                              </div>}
                    {activeScreen === "projects" && <List isEditable={true} listTitle={screenTitle} screenState="projects" onClick={(data) => handleOpenDetails(data, "projekti")} tag="projekti"/>}
                    {activeScreen === "assigned-projects" && <List isEditable={false} listTitle={screenTitle} screenState="projects" onClick={(data) => handleOpenDetails(data, "projekti")} tag="projekti" filterByPoslovodja={true}/>}
                    {activeScreen === "employees" && (
                        <div className="employees-filter-wrapper" style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 20px',
                                background: '#fff',
                                borderBottom: '1px solid #ddd'
                            }}>
                                <h2 style={{ margin: 0 }}>{screenTitle}</h2>
                                <Select
                                    defaultValue="zaposleni"
                                    style={{ width: 200 }}
                                    onChange={(value) => setSelectedEmployeeTag(value)}
                                    options={employeeOptions}
                                />
                            </div>

                            {/* List komponenta sada dobija dinamički tag */}
                            <List
                                isEditable={false}
                                listTitle={false}
                                screenState="user"
                                tag={selectedEmployeeTag}
                                onClick={(data) => handleOpenDetails(data, selectedEmployeeTag)}
                            />
                        </div>
                    )}
                </main>
            </div>

            <CenteredOverlay isVisible={isDetailVisible} onClose={handleCloseDetails}>
                {detailData && (
                    <div style={{ minWidth: '650px', maxWidth: '850px' }}>
                        <EntityDetailCard
                            entityTitle={entityType === 'PROJECT' ? rawEntityData?.naziv : (rawEntityData?.title || rawEntityData?.ime + " " + rawEntityData?.prezime || "Detalji")}
                            entityType={entityType}
                            items={detailData}
                            rawData={rawEntityData}
                            isProject={entityType === 'PROJECT'}
                            userRole={role}
                            onEdit={handleEdit}
                            onDelete={() => {}}
                        />
                    </div>
                )}
            </CenteredOverlay>

        </div>


    );
}

