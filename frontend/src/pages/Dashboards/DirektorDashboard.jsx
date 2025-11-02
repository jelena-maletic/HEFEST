import { useState } from "react";
import './Dashboards.css';
import MapView from "../../components/MapView.jsx";
import Calendar from "../../components/Calendar.jsx";
import hefestLogo from '../../assets/hefest-logo.png';
import hefestLogoInverted from '../../assets/hefest-logo-inverted.png';
import keyIcon from "../../assets/key-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import profileIcon from "../../assets/login-icon.png";
import calendarIcon from "../../assets/kalendar.svg";
import calendarIconInverted from "../../assets/kalendar-inverted.svg";
import usersIcon from "../../assets/users.svg";
import usersIconInverted from "../../assets/users-inverted.svg";
import projectIcon from "../../assets/projekti.svg";
import projectIconInverted from "../../assets/projekti-inverted.svg";
import mapIcon from "../../assets/mapa.svg";
import mapIconInverted from "../../assets/mapa-inverted.svg";
import seeReportsIcon from "../../assets/pregled-izvjestaja.svg";
import seeReportsIconInverted from "../../assets/pregled-izvjestaja-inverted.svg";


function DirektorDashboard() {
    const [logoSrc, setLogoSrc] = useState(hefestLogo);

    const [activeScreen, setActiveScreen] = useState("home")

    const menuItems = [
        { label: "Kalendar", icon: calendarIcon, iconHover: calendarIconInverted },
        { label: "Zaposleni", icon: usersIcon, iconHover: usersIconInverted },
        { label: "Projekti", icon: projectIcon, iconHover: projectIconInverted },
        { label: "Mapa sa radilištima", icon: mapIcon, iconHover: mapIconInverted },
        { label: "Izvještaji", icon: seeReportsIcon, iconHover: seeReportsIconInverted }
    ];

    return (
        <div className="app-container">
            {/* Gornji bar */}
            <header className="top-bar">
                <button
                    className="home-button"
                    onMouseEnter={() => setLogoSrc(hefestLogoInverted)}
                    onMouseLeave={() => setLogoSrc(hefestLogo)}
                    onClick={() => setActiveScreen("home")}
                >
                    <img src={logoSrc} alt="HEFEST Logo" className="logo" />
                </button>

                <div className="page-title">
                    {activeScreen !== "home" && <h3>{activeScreen}</h3>}
                </div>

                <div className="user-info">
                    <span>Direktor</span>
                    <img src={profileIcon} alt="Profil" />
                </div>
            </header>


            <div className="content-area">
                <aside className="sidebar">
                    <nav className="menu">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`menu-btn ${activeScreen === item.label ? "active" : ""}`}
                                onClick={() => setActiveScreen(item.label)}
                                onMouseEnter={(e) => e.currentTarget.querySelector("img").src = item.iconHover}
                                onMouseLeave={(e) => e.currentTarget.querySelector("img").src = item.icon}
                            >
                                <img src={item.icon} alt={item.label} className="menu-icon" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="bottom-section">
                        <div className="bottom-buttons">
                            <button className="icon-btn">
                                <img src={keyIcon} alt="Promjena šifre" className="icon-img key-icon" />
                                <span>Promjena šifre</span>
                            </button>
                            <button className="icon-btn">
                                <img src={logoutIcon} alt="Odjava" className="icon-img logout-icon" />
                                <span>Odjava</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <main className={`home-screen ${activeScreen !== "home" ? "content-active" : ""}`}
                      style={{
                          backgroundImage: activeScreen === "home" ? `url(${hefestLogo})` : "none"
                      }}
                >
                    {activeScreen === "Mapa sa radilištima" && <MapView />}
                    {activeScreen === "Kalendar" && <Calendar />}
                </main>
            </div>
        </div>
    );
}

export default DirektorDashboard;

