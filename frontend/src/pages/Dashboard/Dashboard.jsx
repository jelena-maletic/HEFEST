import {useState} from "react";
import {Modal, Select} from 'antd';
import './Dashboard.css';
import MapView from "../../components/MapView.jsx";
import Calendar from "../../components/Calendar.jsx";
import hefestLogo from '../../assets/hefest-logo.svg';
import {TopBar} from "../../components/TopBar.jsx"
import {Sidebar} from "../../components/Sidebar.jsx";
import {List} from "../../components/List/List.jsx";
import CenteredOverlay from "../../components/CenteredOverlay/CenteredOverlay.jsx";
import EntityDetailCard from "../../components/EntityDetailCard/EntityDetailCard.jsx";
import {formatEntityDetails} from "../../utils/entityDetailFormatter.js";
import {
    deleteElement, getKorisnikPodaci,
    getTehnicarData,
    updateElement,
    updateTehnicarAktivnost,
    updateZahtjevStatus
} from "../../services/apiHelpers.js";
import {useNotification} from "../../components/NotificationContext.jsx";
import DynamicForm from "../../components/DynamicForm.jsx";
import {schemaMap} from "../../data/SchemaMap.jsx";
import {useEffect} from "react";
import {reverseGeocode} from "../../utils/reverseGeocode.js";
import {getJmb} from "../../auth/auth.js";
import CreateDnevniIzvjestajForm from "../../components/CreateDnevniIzvjestajForm.jsx";
import CreateSumarniIzvjestajForm from "../../components/CreateSumarniIzvjestajForm.jsx";


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

    const [refreshCurrentList, setRefreshCurrentList] = useState(null);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [showCreateIzvjestaj, setShowCreateIzvjestaj] = useState(false);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const syncStatusWithBackend = async () => {
            if (role === "tehnicar") {
                try {
                    const jmb = sessionStorage.getItem("jmb");
                    const data = await getTehnicarData(jmb);
                    setIsActive(data.aktivan);
                } catch (err) {
                    console.error("Neuspješno sinhronizovanje statusa:", err);
                }
            }
        };
        syncStatusWithBackend();
    }, [role]);

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
        "dnevni_zadaci": "TASK",
        "zahtjevi": "REQUEST",
        "new-request": "REQUEST",
        "sumarni_izvjestaji":"SUMMARY_REPORT",
        "zaduzenja":"ASSIGNMENT"
    };

    const handleOpenDetails = async (rawData, tag) => {
        const type = TAG_MAP[tag];
        if (!type) return;

        setCurrentTag(tag);

        let enrichedData = {...rawData};

        try {

            if (type === 'PROJECT' && rawData.lokacija) {

                const stvarnaAdresa = await reverseGeocode(rawData.lokacija);

                enrichedData.lokacijaNaziv = stvarnaAdresa;
            }


            const formatted = await formatEntityDetails(enrichedData, type, role);

            setDetailData(formatted.items);
            setRawEntityData(enrichedData);
            setEntityType(type);
            setIsDetailVisible(true);
        } catch (error) {
            console.error("Greška pri otvaranju detalja:", error);
            notify.error("Greška", "Neuspješno učitavanje detalja.");
        }
    };

    const handleCloseDetails = () => {
        setIsDetailVisible(false);
        setDetailData(null);
    };

    const toggleStatus = async () => {
        const jmb = sessionStorage.getItem("jmb");
        const noviStatus = !isActive;

        try {
            await updateTehnicarAktivnost(jmb, noviStatus);

            setIsActive(noviStatus);
            notify.success("Status ažuriran", `Sada ste ${noviStatus ? "aktivni" : "neaktivni"}.`);
        } catch (error) {
            console.error("Greška pri promjeni statusa:", error);
            notify.error("Greška", "Nije moguće ažurirati status na serveru.");
        }
    };

    const handleScreen = (activeScreen, screenTitle) => {
        setActiveScreen(activeScreen);
        setScreenTitle(screenTitle);
    };

    const [selectedEmployeeTag, setSelectedEmployeeTag] = useState("zaposleni");

    const handleRegisterRefresh = (refreshFn) => {
        setRefreshCurrentList((prevFn) => {
            if (prevFn === refreshFn) return prevFn;
            return refreshFn;
        });
    };

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const jmb = getJmb();
            if (jmb) {
                try {
                    const data = await getKorisnikPodaci(jmb);
                    if (data) {
                        setUserName(`${data}`);
                    }
                } catch (err) {
                    console.log(err);
                    setUserName(role);
                }
            }
        };
        fetchUser();
    }, [role]);

    return (
        <div className="app-container">

            <TopBar activeScreen={activeScreen} screenTitle={screenTitle} screenHandle={handleScreen} userName={userName}/>

            <div className="content-area">
                {sidebarContents && role ? (
                    <Sidebar
                        contents={sidebarContents[role]}
                        screenHandle={handleScreen}
                        activeHandle={toggleStatus}
                        active={isActive}
                        userRole={role}
                    />
                ) : (
                    <div className="sidebar-placeholder">Učitavanje menija...</div>
                )}

                <main className={`home-screen ${activeScreen !== "home" ? "content-active" : ""}`}
                      style={{
                          backgroundImage: activeScreen === "home" ? `url(${hefestLogo})` : "none"
                      }}
                >

                    {activeScreen === "map" && (
                        <MapView
                            role={role}
                            onProjectClick={(data) => handleOpenDetails(data, "projekti")}
                        />
                    )}

                    {activeScreen === "calendar" && <Calendar/>}

                    {activeScreen === "report-overview" && <div className={"report-lists"}>
                        <List isEditable={false}
                              listTitle={"Dnevni " + screenTitle.toLowerCase()}
                              screenState="report-overview"
                              dividerWidth={"90%"}
                              tag="dnevni_izvjestaji"
                              onClick={(data) => handleOpenDetails(data, "dnevni_izvjestaji")}
                        />

                        <List isEditable={false}
                              listTitle={"Sumarni " + screenTitle.toLowerCase()}
                              screenState="report-overview"
                              dividerWidth={"90%"}
                              tag="sumarni_izvjestaji"
                              onClick={(data) => handleOpenDetails(data, "sumarni_izvjestaji")} // DODATO
                        />
                    </div>
                    }

                    {activeScreen === "tools" &&
                        <List isEditable={true}
                              listTitle={screenTitle}
                              screenState="tools"
                              tag="radna-oprema"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "radna-oprema")}
                        />
                    }

                    {activeScreen === "vehicles" &&
                        <List isEditable={true}
                              listTitle={screenTitle}
                              screenState="truck"
                              tag="vozila"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "vozila")}
                        />
                    }


                    {activeScreen === "materials" &&
                        <List isEditable={true}
                              listTitle={screenTitle}
                              screenState="material"
                              tag="materijal"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "materijal")}
                        />
                    }

                    {activeScreen === "taken-resources" &&
                        <List isEditable={true}
                              listTitle={screenTitle}
                              screenState="taken-resources"
                              tag="zaduzenja"
                              onClick={(data) => handleOpenDetails(data, "zaduzenja")}
                        />
                    }

                    {activeScreen === "taken-resources-manager" &&
                        <List isEditable={false}
                              listTitle={screenTitle}
                              screenState="taken-resources"
                              onClick={(data) => handleOpenDetails(data, "zaduzenja")}
                              tag="zaduzenja"
                              filterByPoslovodja={true}
                        />
                    }

                    {activeScreen === "request-overview" && (
                        <List
                            key={`list-${activeScreen}-${refreshTrigger}`}
                            isEditable={false}
                            binaryChoice={true}
                            listTitle={screenTitle}
                            onClick={(data) => handleOpenDetails(data, "zahtjevi")}
                            screenState="request-overview"
                            tag="zahtjevi"
                            onSuccess={handleRegisterRefresh}
                            filterByMagacioner={role === "magacioner"}
                        />
                    )}

                    {activeScreen === "technicians" && (
                        <List
                            isEditable={false}
                            listTitle={screenTitle}
                            screenState="user"
                            tag="tehnicari/only"
                            onClick={(data) => handleOpenDetails(data, "tehnicari")}
                            filterByPoslovodja={role === "poslovodja"}
                        />
                    )}

                    {activeScreen === "report-overview-manager" &&
                        <div className={"report-lists"}>
                            <List
                                isEditable={false}
                                listTitle={"Dnevni " + screenTitle.toLowerCase()}
                                screenState="report-overview"
                                dividerWidth={"90%"}
                                tag="dnevni_izvjestaji"
                                onClick={(data) => handleOpenDetails(data, "dnevni_izvjestaji")} // DODATO
                                filterByPoslovodja={true}
                            />

                            <List isEditable={false}
                                  listTitle={"Sumarni " + screenTitle.toLowerCase()}
                                  screenState="report-overview"
                                  dividerWidth={"90%"} tag="sumarni_izvjestaji"
                                  onClick={(data) => handleOpenDetails(data, "sumarni_izvjestaji")} // DODATO
                                  filterByPoslovodja={true}/>
                        </div>
                    }

                    {activeScreen === "projects" &&
                        <List isEditable={true}
                              listTitle={screenTitle}
                              screenState="projects"
                              onClick={(data) => handleOpenDetails(data, "projekti")}
                              onSuccess={handleRegisterRefresh}
                              tag="projekti"
                        />
                    }

                    {activeScreen === "assigned-projects" &&
                        <List isEditable={false}
                              listTitle={screenTitle}
                              screenState="projects"
                              onClick={(data) => handleOpenDetails(data, "projekti")}
                              tag="projekti"
                              filterByPoslovodja={true}
                        />
                    }

                    {activeScreen === "tasks" && (
                        <List
                            isEditable={role === "poslovodja"}
                            listTitle="Moji dnevni zadaci"
                            screenState="tasks"
                            tag="moji_dnevni_zadaci"
                            filterByTehnicar={true}
                            onClick={(data) => handleOpenDetails(data, "dnevni_zadaci")}
                            onSuccess={handleRegisterRefresh}
                        />
                    )}

                    {activeScreen === "manage-tasks" && (
                        <List
                            isEditable={role === "poslovodja"}
                            listTitle="Upravljanje zadacima"
                            screenState="tasks"
                            tag="dnevni_zadaci"
                            filterByPoslovodja={true}
                            onClick={(data) => handleOpenDetails(data, "dnevni_zadaci")}
                            onSuccess={handleRegisterRefresh}
                        />
                    )}

                    {activeScreen === "employees" && (
                        <List
                            isEditable={false}
                            listTitle = {screenTitle}
                            screenState="user"
                            tag={selectedEmployeeTag}
                            onClick={(data) => handleOpenDetails(data, selectedEmployeeTag)}
                        />
                    )}

                    {activeScreen === "daily-report-overview-manager" && (
                        <List
                            isEditable={false}
                            listTitle={screenTitle}
                            screenState="report-overview"
                            tag="dnevni_izvjestaji"
                            onClick={(data) => handleOpenDetails(data, "dnevni_izvjestaji")} // DODATO
                            filterByTehnicar={true}
                        />
                    )}

                    {activeScreen === "new-request" && (
                        <List
                            isEditable={true}
                            listTitle={screenTitle}
                            screenState="request-overview"
                            tag="zahtjevi"
                            filterByPoslovodja={true}
                            onSuccess={handleRegisterRefresh}
                            onClick={(data) => handleOpenDetails(data, "zahtjevi")}
                        />
                    )}

                    <Modal
                        title={null}
                        open={activeScreen === "add-report"}
                        onCancel={() => handleScreen("home", "home")}
                        footer={null}
                        width={900}
                        centered
                        destroyOnClose
                    >
                        <CreateDnevniIzvjestajForm
                            role={role}
                            onClose={() => handleScreen("home", "home")}
                            onSuccess={() => {
                                handleScreen("home", "home");
                            }}
                        />
                    </Modal>
                    <Modal
                        title={null}
                        open={activeScreen === "add-summary-report"}
                        onCancel={() => handleScreen("home", "home")}
                        footer={null}
                        width={1000}
                        centered
                        destroyOnClose
                    >
                        <CreateSumarniIzvjestajForm
                            onClose={() => handleScreen("home", "home")}
                            onSuccess={() => {
                                handleScreen("home", "home");
                                triggerRefresh();
                            }}
                        />
                    </Modal>

                </main>
            </div>

            <CenteredOverlay isVisible={isDetailVisible} onClose={handleCloseDetails}>
                {detailData && (
                    <div style={{minWidth: '650px', maxWidth: '850px'}}>
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
                                    const apiTag = currentTag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : currentTag;
                                    const responseStatus = await deleteElement(apiTag, rawEntityData.id);

                                    if (responseStatus >= 200 && responseStatus < 300) {
                                        notify.success("Obrisano", "Element je uspješno uklonjen.");
                                        if (refreshCurrentList) refreshCurrentList();
                                        triggerRefresh();
                                        setIsDetailVisible(false);
                                    }
                                } catch (error) {
                                    console.error("Greška pri brisanju:", error);
                                    console.error("Greška objekat:", error.response);

                                    const porukaSaServera = error.response?.data?.message
                                        || error.response?.data
                                        || "Došlo je do greške pri brisanju.";

                                    notify.error("Brisanje nije uspjelo", porukaSaServera);
                                    notify.error("Greška", "Neuspješno brisanje elementa.");
                                }
                            }}
                            onConfirm={async () => {
                                try {
                                    await updateZahtjevStatus(rawEntityData.id, "odobren");
                                    notify.success("Odobreno", "Zahtjev je uspješno odobren.");
                                    if (refreshCurrentList) refreshCurrentList();
                                    triggerRefresh();
                                    setIsDetailVisible(false);
                                } catch (error) {
                                    notify.error("Greška", "Nije uspjelo odobravanje zahtjeva.", error);
                                }
                            }}
                            onDeny={async () => {
                                try {
                                    await updateZahtjevStatus(rawEntityData.id, "neodobren");
                                    notify.success("Odbijeno", "Zahtjev je odbijen.");
                                    if (refreshCurrentList) refreshCurrentList();
                                    setIsDetailVisible(false);
                                } catch (error) {
                                    notify.error("Greška", "Nije uspjelo odbijanje zahtjeva.", error);
                                }
                            }}
                        />
                    </div>
                )}
            </CenteredOverlay>


            {isEditFormVisible && (
                <CenteredOverlay className="form-overlay" isVisible={isEditFormVisible}
                                 onClose={() => setIsEditFormVisible(false)}>
                    <DynamicForm
                        className="form"
                        schema={schemaMap[currentTag]}
                        onClose={() => setIsEditFormVisible(false)}
                        initialValues={rawEntityData}
                        onSubmit={async (formData) => {
                            try {
                                const apiTag = currentTag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : currentTag;
                                await updateElement(apiTag, rawEntityData.id, formData);
                                notify.success("Izmijenjeno", "Podaci su uspješno ažurirani.");
                                if (refreshCurrentList) refreshCurrentList();
                                setIsEditFormVisible(false);
                                setIsDetailVisible(false);
                            } catch (error) {
                                notify.error("Greška", "Ažuriranje nije uspjelo.", error);
                            }
                        }}
                    />
                </CenteredOverlay>
            )}
        </div>
    );
}

