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
import { deleteElement, updateElement } from "../../services/apiHelpers.js";
import { useNotification } from "../../components/NotificationContext.jsx";
import DynamicForm from "../../components/DynamicForm.jsx";
import { schemaMap } from "../../data/SchemaMap.jsx";


export function Dashboard({sidebarContents, role}) {
    const [isActive, setIsActive] = useState(false);
    const [activeScreen, setActiveScreen] = useState("home");
    const [screenTitle, setScreenTitle] = useState("home");



    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [rawEntityData, setRawEntityData] = useState(null);
    const [entityType, setEntityType] = useState("");

    const [currentTag, setCurrentTag] = useState("");
    const notify = useNotification();

    const [isEditFormVisible, setIsEditFormVisible] = useState(false);

    const TAG_MAP = {
        "projekti": "PROJECT",
        "zaposleni": "EMPLOYEE",
        "tehnicari": "EMPLOYEE",
        "poslovodje": "EMPLOYEE",
        "magacioneri": "EMPLOYEE",
        "knjigovodje": "EMPLOYEE",
        "tehnicari/only": "EMPLOYEE",
        "vozila": "VEHICLE",
        "radna-oprema": "TOOL",
        "materijal": "MATERIAL",
        "dnevni_izvjestaji": "REPORT",
        "dnevni_zadaci": "TASK"
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

        setCurrentTag(tag);
        try {
            const formatted = await formatEntityDetails(rawData, type, role);
            setDetailData(formatted.items);
            setRawEntityData(rawData);
            setEntityType(type);
            setIsDetailVisible(true);
        } catch (error) {
            console.error("Greška pri formatiranju detalja:", error);
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
                    {/* Radna oprema */}
                    {activeScreen === "tools" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="tools" tag="radna-oprema"
                              onClick={(data) => handleOpenDetails(data, "radna-oprema")} />}

                    {/* Vozila */}
                    {activeScreen === "vehicles" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="truck" tag="vozila"
                              onClick={(data) => handleOpenDetails(data, "vozila")} />}

                    {/* Materijal */}
                    {activeScreen === "materials" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="material" tag="materijal"
                              onClick={(data) => handleOpenDetails(data, "materijal")} />}
                    {activeScreen === "taken-resources" && <List isEditable={true} listTitle={screenTitle} screenState="taken-resources" tag="zaduzenja" />}
                    {activeScreen === "request-overview" && <List isEditable={false} listTitle={screenTitle} screenState="request-overview" tag="zahtjevi" />}
                    {activeScreen === "technicians" && (
                        <List
                            isEditable={false}
                            listTitle={screenTitle}
                            screenState="user"
                            tag="tehnicari/only"
                            onClick={(data) => handleOpenDetails(data, "tehnicari")}
                        />
                    )}
                    {activeScreen === "report-overview-manager" && <div className={"report-lists"}>
                                                                <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="dnevni_izvjestaji" />
                                                                 <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                                                              </div>}
                    {activeScreen === "projects" && <List isEditable={true} listTitle={screenTitle} screenState="projects" onClick={(data) => handleOpenDetails(data, "projekti")} tag="projekti"/>}
                    {activeScreen === "assigned-projects" && <List isEditable={false} listTitle={screenTitle} screenState="projects" onClick={(data) => handleOpenDetails(data, "projekti")} tag="projekti" filterByPoslovodja={true}/>}

                    {activeScreen === "tasks" && (
                        <List
                            isEditable={false}
                            listTitle="Moji dnevni zadaci"
                            screenState="tasks"
                            tag="dnevni_zadaci"
                            onClick={(data) => handleOpenDetails(data, "dnevni_zadaci")}
                        />
                    )}

                    {activeScreen === "manage-tasks" && (
                        <List
                            isEditable={true}
                            listTitle="Upravljanje zadacima"
                            screenState="manage_tasks"
                            tag="dnevni_zadaci"
                            onClick={(data) => handleOpenDetails(data, "dnevni_zadaci")}
                        />
                    )}
                    {activeScreen === "employees" && (
                        <List
                            isEditable={false}
                            listTitle={
                                <Select
                                    defaultValue="zaposleni"
                                    variant="borderless"
                                    className="header-select"
                                    onChange={(value) => setSelectedEmployeeTag(value)}
                                    options={employeeOptions}
                                    dropdownMatchSelectWidth={false}
                                />
                            }
                            screenState="user"
                            tag={selectedEmployeeTag}
                            onClick={(data) => handleOpenDetails(data, selectedEmployeeTag)}
                        />
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
                            onEdit={() => setIsEditFormVisible(true)}
                            onDelete={async () => {
                                try {

                                    const responseStatus = await deleteElement(currentTag, rawEntityData.id);

                                    if (responseStatus >= 200 && responseStatus < 300) {
                                        notify.success("Obrisano", "Element je uspješno uklonjen.");
                                        setIsDetailVisible(false);
                                    }
                                } catch (error) {
                                    console.error("Greška pri brisanju:", error);
                                    notify.error("Greška", "Neuspješno brisanje elementa.");
                                }
                            }}
                        />
                    </div>
                )}
            </CenteredOverlay>

            {/* DINAMIČKA FORMA ZA IZMJENU */}
            {isEditFormVisible && (
                <CenteredOverlay className="form-overlay" isVisible={isEditFormVisible} onClose={() => setIsEditFormVisible(false)}>
                    <DynamicForm
                        className="form"
                        schema={schemaMap[currentTag]}
                        onClose={() => setIsEditFormVisible(false)}
                        initialValues={rawEntityData}
                        onSubmit={async (formData) => {
                            try {
                                await updateElement(currentTag, rawEntityData.id, formData);
                                notify.success("Izmijenjeno", "Podaci su uspješno ažurirani.");
                                setIsEditFormVisible(false);
                                setIsDetailVisible(false); // Zatvori i detalje da se osvježi lista
                            } catch (error) {
                                notify.error("Greška", "Ažuriranje nije uspjelo.");
                            }
                        }}
                    />
                </CenteredOverlay>
            )}

        </div>


    );
}

