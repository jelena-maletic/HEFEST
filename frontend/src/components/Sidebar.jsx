import "./Sidebar.css"
import statusIcon from "../assets/user-check.svg";
import statusIconInverted from "../assets/user-check-inverted.svg";
import keyIcon from "../assets/key-icon.svg";
import keyIconInverted from "../assets/key-icon-inverted.svg";
import logoutIcon from "../assets/logout-icon.svg";
import logoutIconInverted from "../assets/logout-icon-inverted.svg";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loadAssets} from "../utils/dataHelpers.js";
import {useNotification} from "./NotificationContext.jsx";
import {useDarkMode} from "./DarkModeContext.jsx";
import sunIcon from "../assets/sun.svg";
import moonIcon from "../assets/moon.svg";
import moonIconInverted from "../assets/moon-inverted.svg";
import DynamicForm from "../components/DynamicForm.jsx";
import CenteredOverlay from "../components/CenteredOverlay/CenteredOverlay.jsx";
import axios from "axios";
import {changePasswordSchema} from "../data/Forms.jsx";

export function Sidebar({contents, screenHandle, activeHandle, active, userRole, currentScreen}) {
    const [activeScreen, setActiveScreen] = useState("home");
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { isDark, toggleDarkMode } = useDarkMode();

    const images = loadAssets();

    const navigate = useNavigate();
    const notify = useNotification();

    return (
        <>
            <aside className="sidebar">
                <nav className="menu">
                    {(contents || []).map((item, index) => (
                        <button
                            key={index}
                            className={`menu-btn ${currentScreen === item.tag ? "active" : ""}`}
                            onClick={() => {
                                screenHandle(item.tag, item.label);
                                setActiveScreen(item.tag);
                            }}
                            onMouseEnter={(e) => {
                                const hoverIcon = isDark ? images[`${item.icon}`] : images[`${item.iconHover}`];
                                if (hoverIcon) e.currentTarget.querySelector("img").src = hoverIcon;
                            }}
                            onMouseLeave={(e) => {
                                const isActive = currentScreen === item.tag;
                                const restIcon = (isDark && !isActive)
                                    ? images[`${item.iconHover}`]
                                    : images[`${item.icon}`];
                                if (restIcon) e.currentTarget.querySelector("img").src = restIcon;
                            }}
                        >
                            <img
                                src={
                                    (isDark && currentScreen !== item.tag)
                                        ? images[`${item.iconHover}`]
                                        : images[`${item.icon}`]
                                }
                                alt={item.label}
                                className="menu-icon"
                            />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="bottom-section">
                    {(userRole === "tehnicar" || userRole === "poslovodja") && (
                        <div className="status-toggle">
                            <label>
                                <div className="status-label">
                                    <img src={isDark ? statusIconInverted : statusIcon} alt="Status" className="status-icon"/>
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
                    )}

                    <div className="status-toggle">
                        <label>
                            <div className="status-label">
                                <img src={isDark ? moonIcon : moonIconInverted} className="dark-mode-icon"/>
                                Tamni mod
                            </div>
                            <div
                                className={`toggle-switch ${isDark ? "active" : ""}`}
                                onClick={toggleDarkMode}
                            >
                                <div className="slider"></div>
                                <img
                                    src={isDark ? moonIcon : sunIcon}
                                    alt={isDark ? "Dark mode" : "Light mode"}
                                    className="toggle-mode-icon"
                                />
                            </div>
                        </label>
                    </div>

                    <div className="bottom-buttons">
                        <button className="icon-btn" onClick={() => setShowPasswordForm(true)}>
                            <img src={isDark ? keyIconInverted : keyIcon} alt="Promjena šifre" className="icon-img key-icon"/>
                            <span>Promjena šifre</span>
                        </button>
                        <button className="icon-btn" onClick={() => navigate('/')}>
                            <img src={isDark ? logoutIconInverted : logoutIcon} alt="Odjava" className="icon-img logout-icon"/>
                            <span>Odjava</span>
                        </button>
                    </div>
                </div>
            </aside>

            {showPasswordForm && (
                <CenteredOverlay isVisible={showPasswordForm} onClose={() => setShowPasswordForm(false)}>
                    <DynamicForm
                        schema={changePasswordSchema}
                        onClose={() => setShowPasswordForm(false)}
                        onSubmit={async (data) => {
                            try {
                                if (data.newPassword !== data.confirmPassword) {
                                    notify.error("Greška", "Lozinke se ne poklapaju!");
                                    return;
                                }

                                console.log(sessionStorage.getItem("token"));
                                await axios.post(
                                    "http://localhost:8080/api/korisnici/change-password",
                                    {
                                        oldPassword: data.oldPassword,
                                        newPassword: data.newPassword
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${sessionStorage.getItem("token")}`
                                        }
                                    }
                                );

                                notify.success("Uspješno", "Lozinka je promijenjena.");
                                setShowPasswordForm(false);
                            } catch (err) {
                                console.error(err);
                                notify.error("Greška", "Došlo je do greške pri promjeni lozinke.");
                            }
                        }}
                    />
                </CenteredOverlay>
            )}
        </>

    );
}