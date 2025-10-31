import { useState } from "react";
import './Dashboards.css';
import hefestLogo from '../../assets/hefest-logo.png';
import hefestLogoInverted from '../../assets/hefest-logo-inverted.png';
import keyIcon from "../../assets/key-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import profileIcon from "../../assets/login-icon.png";
import toolIcon from "../../assets/alat.svg";
import toolIconInverted from "../../assets/alat-inverted.svg";
import truckIcon from "../../assets/kamion.svg";
import truckIconInverted from "../../assets/kamion-inverted.svg";
import materialIcon from "../../assets/materijal.svg";
import materialIconInverted from "../../assets/materijal-inverted.svg";
import takenResourcesIcon from "../../assets/zaduzeni-resursi.svg";
import takenResourcesIconInverted from "../../assets/zaduzeni-resursi-inverted.svg";
import seeRequestsIcon from "../../assets/pregled-zahtjeva.svg";
import seeRequestsIconInverted from "../../assets/pregled-zahtjeva-inverted.svg";


function MagacionerDashboard() {
    const [logoSrc, setLogoSrc] = useState(hefestLogo);

    const menuItems = [
        { label: "Radna oprema", icon: toolIcon, iconHover: toolIconInverted },
        { label: "Vozila", icon: truckIcon, iconHover: truckIconInverted },
        { label: "Materijal", icon: materialIcon, iconHover: materialIconInverted },
        { label: "Zaduženi resursi", icon: takenResourcesIcon, iconHover: takenResourcesIconInverted },
        { label: "Zahtjevi za resursima", icon: seeRequestsIcon, iconHover: seeRequestsIconInverted }
    ];

    return (
        <div className="app-container">
            {/* Gornji bar */}
            <header className="top-bar">
                <button
                    className="home-button"
                    onMouseEnter={() => setLogoSrc(hefestLogoInverted)}
                    onMouseLeave={() => setLogoSrc(hefestLogo)}
                >
                    <img src={logoSrc} alt="HEFEST Logo" className="logo" />
                </button>

                <div className="user-info">
                    <span>Magacioner</span>
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

export default MagacionerDashboard;