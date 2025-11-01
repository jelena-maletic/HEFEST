import { useState } from "react";
import './Dashboards.css';
import hefestLogo from '../../assets/hefest-logo.png';
import hefestLogoInverted from '../../assets/hefest-logo-inverted.png';
import statusIcon from "../../assets/user-check.svg";
import keyIcon from "../../assets/key-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import profileIcon from "../../assets/login-icon.png";
import taskIcon from "../../assets/dnevni-zadaci.svg";
import taskIconInverted from "../../assets/dnevni-zadaci-inverted.svg";
import addReportIcon from "../../assets/dodavanje-izvjestaja.svg";
import addReportIconInverted from "../../assets/dodavanje-izvjestaja-inverted.svg";

function TehnicarDashboard() {
    const [isActive, setIsActive] = useState(false);
    const [logoSrc, setLogoSrc] = useState(hefestLogo);

    const [activeScreen, setActiveScreen] = useState("home");

    const toggleStatus = () => setIsActive(!isActive);

    const menuItems = [
        { label: "Dnevni zadaci", icon: taskIcon, iconHover: taskIconInverted },
        { label: "Kreiranje izvještaja", icon: addReportIcon, iconHover: addReportIconInverted }
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
                    <span>Tehničar</span>
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
                        <div className="status-toggle">
                            <label>
                                <div className="status-label">
                                    <img src={statusIcon} alt="Status" className="status-icon" />
                                    Dnevni status
                                </div>
                                <div
                                    className={`toggle-switch ${isActive ? "active" : ""}`}
                                    onClick={toggleStatus}
                                >
                                    <div className="slider"></div>
                                    <span className="status-text">{isActive ? "Aktivan" : "Neaktivan"}</span>
                                </div>
                            </label>
                        </div>

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

export default TehnicarDashboard;

