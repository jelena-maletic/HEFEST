import hefestLogo from "../assets/hefest-logo.svg";
import hefestLogoInverted from '../assets/hefest-logo-inverted.svg';
import profileIcon from "../assets/login-icon.png";
import "./TopBar.css"
import {useState} from "react";


export function TopBar({ activeScreen, screenTitle, screenHandle, userName}) {

    const [logoSrc, setLogoSrc] = useState(hefestLogo);
    return (
        <header className="top-bar">
            <button
                className="home-button"
                onMouseEnter={() => setLogoSrc(hefestLogoInverted)}
                onMouseLeave={() => setLogoSrc(hefestLogo)}
                onClick={() => screenHandle("home", "")}
            >
                <img src={logoSrc} alt="HEFEST Logo" className="logo" />
            </button>

            <div className="page-title">
                {activeScreen !== "home" && <h3>{screenTitle}</h3>}
            </div>

            <div className="user-info">
                <span>{userName}</span>
                <img src={profileIcon} alt="Profil" />
            </div>
        </header>
    )
}