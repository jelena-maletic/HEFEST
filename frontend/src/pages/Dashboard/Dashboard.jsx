import {useState} from "react";
import './Dashboard.css';
import MapView from "../../components/MapView.jsx";
import Calendar from "../../components/Calendar.jsx";
import hefestLogo from '../../assets/hefest-logo.svg';
import {TopBar} from "../../components/TopBar.jsx"
import {Sidebar} from "../../components/Sidebar.jsx";
import {List} from "../../components/List/List.jsx";


export function Dashboard({sidebarContents, role}) {
    const [isActive, setIsActive] = useState(false);
    const [activeScreen, setActiveScreen] = useState("home");
    const [screenTitle, setScreenTitle] = useState("home");

    const toggleStatus = () => setIsActive(!isActive);

    const handleScreen = (activeScreen, screenTitle) => {
        setActiveScreen(activeScreen);
        setScreenTitle(screenTitle);
        console.log(activeScreen, screenTitle);
    };

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
                    {activeScreen === "employees" && <List isEditable={false} listTitle={screenTitle} screenState="user" tag="zaposleni" />}
                    {activeScreen === "report-overview" && <div className={"report-lists"}>
                                                                <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="dnevni_izvjestaji" />
                                                                <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview" dividerWidth={"90%"} tag="sumarni_izvjestaji"/>
                                                            </div>}
                    {activeScreen === "tools" && <List isEditable={true} listTitle={screenTitle} screenState="tools" tag="radna-oprema" />}
                    {activeScreen === "vehicles" && <List isEditable={true} listTitle={screenTitle} screenState="truck" tag="vozila" />}
                    {activeScreen === "materials" && <List isEditable={true} listTitle={screenTitle} screenState="material" tag="materijal" />}
                    {activeScreen === "taken-resources" && <List isEditable={true} listTitle={screenTitle} screenState="taken-resources"/>}
                    {activeScreen === "request-overview" && <List isEditable={false} listTitle={screenTitle} screenState="request-overview" tag="resursi-u-zahtjevu" />}
                    {activeScreen === "technicians" && <List isEditable={false} listTitle={screenTitle} screenState="user" tag="tehnicari"/>}
                    {activeScreen === "report-overview-manager" && <List isEditable={false} listTitle={screenTitle} screenState="report-overview" />}
                </main>
            </div>
        </div>
    );
}

