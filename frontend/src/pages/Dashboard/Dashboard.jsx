import {useState} from "react";
import {Select} from 'antd';
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
    deleteElement,
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
        "new-request": "REQUEST"
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

        // Kopiramo rawData da ne bismo mutirali originalni objekt iz liste
        let enrichedData = {...rawData};

        try {
            // AKO JE PROJEKAT: Pretvaramo koordinate u adresu
            if (type === 'PROJECT' && rawData.lokacija) {
                // Pozivamo tvoju funkciju iz utils
                const stvarnaAdresa = await reverseGeocode(rawData.lokacija);
                // Dodajemo novo polje koje će mapper prepoznati
                enrichedData.lokacijaNaziv = stvarnaAdresa;
            }

            // Formatiramo podatke (sada enrichedData ima lokacijaNaziv, managerIme, itd.)
            const formatted = await formatEntityDetails(enrichedData, type, role);

            // Punimo state-ove za prikaz
            setDetailData(formatted.items);
            setRawEntityData(enrichedData); // Čuvamo obogaćene podatke (sa adresom)
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
        console.log(activeScreen, screenTitle);
    };

    const [selectedEmployeeTag, setSelectedEmployeeTag] = useState("zaposleni");

    const employeeOptions = [
        {value: "zaposleni", label: "Svi zaposleni"},
        {value: "knjigovodje", label: "Knjigovođe"},
        {value: "poslovodje", label: "Poslovođe"},
        {value: "magacioneri", label: "Magacioneri"},
        {value: "tehnicari", label: "Tehničari"}
    ];

    const handleRegisterRefresh = (refreshFn) => {
        setRefreshCurrentList((prevFn) => {
            if (prevFn === refreshFn) return prevFn;
            return refreshFn;
        });
    };

    return (
        <div className="app-container">

            <TopBar activeScreen={activeScreen} screenTitle={screenTitle} screenHandle={handleScreen} role={role}/>

            <div className="content-area">

                <Sidebar contents={sidebarContents[role]} screenHandle={handleScreen}
                         activeHandle={toggleStatus} active={isActive} userRole={role}/>

                <main className={`home-screen ${activeScreen !== "home" ? "content-active" : ""}`}
                      style={{
                          backgroundImage: activeScreen === "home" ? `url(${hefestLogo})` : "none"
                      }}
                >

                    {activeScreen === "map" && <MapView role={role}/>}
                    {activeScreen === "calendar" && <Calendar/>}
                    {/*{activeScreen === "employees" && <List isEditable={false} listTitle={screenTitle} screenState="user" tag="zaposleni" />}*/}
                    {activeScreen === "report-overview" && <div className={"report-lists"}>
                        <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview"
                              dividerWidth={"90%"} tag="dnevni_izvjestaji"/>
                        <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview"
                              dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                    </div>}
                    {/* Radna oprema */}
                    {activeScreen === "tools" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="tools" tag="radna-oprema"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "radna-oprema")}/>}

                    {/* Vozila */}
                    {activeScreen === "vehicles" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="truck" tag="vozila"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "vozila")}/>}

                    {/* Materijal */}
                    {activeScreen === "materials" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="material" tag="materijal"
                              onSuccess={handleRegisterRefresh}
                              onClick={(data) => handleOpenDetails(data, "materijal")}/>}
                    {activeScreen === "taken-resources" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="taken-resources" tag="zaduzenja"/>}
                    {activeScreen === "taken-resources-manager" &&
                        <List isEditable={false} listTitle={screenTitle} screenState="taken-resources"
                              onClick={(data) => handleOpenDetails(data, "zaduzenja")} tag="zaduzenja"
                              filterByPoslovodja={true}/>}

                    {activeScreen === "request-overview" && <List key={`list-${activeScreen}-${refreshTrigger}`}
                                                                  isEditable={false}
                                                                  binaryChoice={true}
                                                                  listTitle={screenTitle}
                                                                  onClick={(data) => handleOpenDetails(data, "zahtjevi")}
                                                                  screenState="request-overview"
                                                                  tag="zahtjevi"
                                                                  onSuccess={handleRegisterRefresh}/>}
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
                        <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview"
                              dividerWidth={"90%"} tag="dnevni_izvjestaji"/>
                        <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview"
                              dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                    </div>}
                    {activeScreen === "projects" &&
                        <List isEditable={true} listTitle={screenTitle} screenState="projects"
                              onClick={(data) => handleOpenDetails(data, "projekti")} onSuccess={handleRegisterRefresh}
                              tag="projekti"/>}
                    {activeScreen === "assigned-projects" &&
                        <List isEditable={false} listTitle={screenTitle} screenState="projects"
                              onClick={(data) => handleOpenDetails(data, "projekti")} tag="projekti"
                              filterByPoslovodja={true}/>}

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
                            screenState="manage_tasks"
                            tag="dnevni_zadaci"
                            filterByPoslovodja={true}
                            onClick={(data) => handleOpenDetails(data, "dnevni_zadaci")}
                            onSuccess={handleRegisterRefresh}
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

                    {activeScreen === "new-request" && (
                        <List
                            isEditable={true} // Omogućava dugme "Novi" (plus)
                            listTitle={screenTitle}
                            screenState="request-overview"
                            tag="zahtjevi"
                            filterByPoslovodja={true} // Da poslovođa vidi samo svoje poslate zahtjeve
                            onSuccess={handleRegisterRefresh} // Bitno da se lista osvježi nakon što DynamicForm završi slanje
                            onClick={(data) => handleOpenDetails(data, "zahtjevi")}
                        />
                    )}

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
                                    notify.error("Greška", "Nije uspjelo odobravanje zahtjeva.");
                                }
                            }}
                            onDeny={async () => {
                                try {
                                    await updateZahtjevStatus(rawEntityData.id, "neodobren");
                                    notify.success("Odbijeno", "Zahtjev je odbijen.");
                                    if (refreshCurrentList) refreshCurrentList();
                                    setIsDetailVisible(false);
                                } catch (error) {
                                    notify.error("Greška", "Nije uspjelo odbijanje zahtjeva.");
                                }
                            }}
                        />
                    </div>
                )}
            </CenteredOverlay>

            {/* DINAMIČKA FORMA ZA IZMJENU */}
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
                                console.log(rawEntityData.id);
                                await updateElement(apiTag, rawEntityData.id, formData);
                                notify.success("Izmijenjeno", "Podaci su uspješno ažurirani.");
                                if (refreshCurrentList) refreshCurrentList();
                                setIsEditFormVisible(false);
                                setIsDetailVisible(false);
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

