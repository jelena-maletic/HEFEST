import "./Sidebar.css"
import statusIcon from "../assets/user-check.svg";
import keyIcon from "../assets/key-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loadAssets} from "../utils/dataHelpers.js";


export function Sidebar({contents, screenHandle, activeHandle, active}) {
    const [activeScreen, setActiveScreen] = useState("home");

    const images = loadAssets();

    const navigate = useNavigate();
    return (<aside className="sidebar">
        <nav className="menu">
            {contents.map((item, index) => (
                <button
                    key={index}
                    className={`menu-btn ${activeScreen === item.label ? "active" : ""}`}
                    onClick={() => {
                        screenHandle(item.tag, item.label);
                        setActiveScreen(item.tag);
                    }}
                    onMouseEnter={(e) => e.currentTarget.querySelector("img").src = images[`${item.iconHover}`]}
                    onMouseLeave={(e) => e.currentTarget.querySelector("img").src = images[`${item.icon}`]}
                >
                    <img src={images[`${item.icon}`]} alt={item.label} className="menu-icon" />
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
                        className={`toggle-switch ${active ? "active" : ""}`}
                        onClick={activeHandle}
                    >
                        <div className="slider"></div>
                        <span className="status-text">{active ? "Aktivan" : "Neaktivan"}</span>
                    </div>
                </label>
            </div>

            <div className="bottom-buttons">
                <button className="icon-btn">
                    <img src={keyIcon} alt="Promjena šifre" className="icon-img key-icon" />
                    <span>Promjena šifre</span>
                </button>
                <button className="icon-btn" onClick={() => navigate('/')}>
                    <img src={logoutIcon} alt="Odjava" className="icon-img logout-icon" />
                    <span>Odjava</span>
                </button>
            </div>
        </div>
    </aside>)
}