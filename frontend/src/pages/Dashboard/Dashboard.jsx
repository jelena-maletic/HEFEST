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

    const data = [
        {title: `Ovo je glavni tekst`, detail: `isto vazi i za ovaj tekst`, subline: `ovo je za datume ili sta vec`},
        {title: `koji se moze dinamicki mijenjati`, detail: `i za svaki ostali tekst`, subline: `7.21.2024.`},
        {title: `u kodu preko liste u nizu`, detail: `mozda je ovo trebalo biti poredano po elementima`},
        {title: `na primjer : `, detail: `eeehhh nije toliko vazno`, subline: `^ ali nije uvijek tu`}
    ]

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
                    {activeScreen === "employees" && <List isEditable={false} listTitle={screenTitle} screenState="user" listData={data} tag="zaposleni" onClick={() => { console.log("a") } }/>}
                    {activeScreen === "report-overview" && <div className={"report-lists"}>
                                                                <List isEditable={false} listTitle={"Dnevni " + screenTitle} screenState="report-overview" listData={data} tag="dnevni_izvjestaji" dividerWidth={"90%"} />
                                                                <List isEditable={false} listTitle={"Sumarni " + screenTitle} screenState="report-overview" listData={data} tag="sumarni_izvjestaji" dividerWidth={"90%"}/>
                                                            </div>}
                    {activeScreen === "tools" && <List isEditable={true} listTitle={screenTitle} screenState="tools" listData={data} tag="radna-oprema" />}
                    {activeScreen === "vehicles" && <List isEditable={true} listTitle={screenTitle} screenState="truck" listData={data} tag="vozila" />}
                    {activeScreen === "materials" && <List isEditable={true} listTitle={screenTitle} screenState="material" listData={data} tag="materijal" />}
                    {activeScreen === "taken-resources" && <List isEditable={true} listTitle={screenTitle} screenState="taken-resources" listData={data} tag="resursi-u-zahtjevu" />}
                    {activeScreen === "request-overview" && <List isEditable={false} listTitle={screenTitle} screenState="request-overview" listData={data} tag="zahtjevi" />}
                    {activeScreen === "technicians" && <List isEditable={false} listTitle={screenTitle} screenState="user" listData={data} tag="tehnicari" />}
                    {activeScreen === "report-overview-manager" && <List isEditable={false} listTitle={screenTitle} screenState="report-overview" listData={data} tag="izvjestaji" />}
                </main>
            </div>
        </div>
    );
}

