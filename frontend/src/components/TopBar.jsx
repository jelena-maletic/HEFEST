import hefestLogo from "../assets/hefest-logo.svg";
import hefestLogoInverted from '../assets/hefest-logo-inverted.svg';
import profileIcon from "../assets/login-icon.svg";
import "./TopBar.css"
import {useState} from "react";
import {useDarkMode} from "./DarkModeContext.jsx";


export function TopBar({ activeScreen, screenTitle, screenHandle, userName}) {

    const { isDark } = useDarkMode();

    const [logoSrc, setLogoSrc] = useState( isDark ? hefestLogoInverted : hefestLogo);
    return (
        <header className="top-bar">
            <button
                className="home-button"
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