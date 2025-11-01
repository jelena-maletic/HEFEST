import { useState } from "react";
import './Dashboards.css';
import hefestLogo from '../../assets/hefest-logo.png';
import hefestLogoInverted from '../../assets/hefest-logo-inverted.png';
import keyIcon from "../../assets/key-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import profileIcon from "../../assets/login-icon.png";
import usersIcon from "../../assets/users.svg";
import usersIconInverted from "../../assets/users-inverted.svg";
import seeReportsIcon from "../../assets/pregled-izvjestaja.svg";
import seeReportsIconInverted from "../../assets/pregled-izvjestaja-inverted.svg";

function KnjigovodjaDashboard() {
    const [logoSrc, setLogoSrc] = useState(hefestLogo);

    const [activeScreen, setActiveScreen] = useState("home");

    const menuItems = [
        { label: "Zaposleni", icon: usersIcon, iconHover: usersIconInverted },
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

                <div className="user-info">
                    <span>Knjigovođa</span>
                    <img src={profileIcon} alt="Profil" />
                </div>
            </header>


            <div className="content-area">
                <aside className="sidebar">
                    <nav className="menu">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className="menu-btn"
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

                <main className="home-screen" style={{ backgroundImage: `url(${hefestLogo}`}}></main>
            </div>
        </div>
    );
}

export default KnjigovodjaDashboard;

