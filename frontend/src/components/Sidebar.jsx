import "./Sidebar.css"
import statusIcon from "../assets/user-check.svg";
import keyIcon from "../assets/key-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loadAssets} from "../utils/dataHelpers.js";
import {useNotification} from "./NotificationContext.jsx";
import DynamicForm from "../components/DynamicForm.jsx";
import CenteredOverlay from "../components/CenteredOverlay/CenteredOverlay.jsx";
import axios from "axios";
import {changePasswordSchema} from "../data/Forms.jsx";

export function Sidebar({contents, screenHandle, activeHandle, active, userRole}) {
    const [activeScreen, setActiveScreen] = useState("home");
    const [showPasswordForm, setShowPasswordForm] = useState(false);

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
                            className={`menu-btn ${activeScreen === item.label ? "active" : ""}`}
                            onClick={() => {
                                screenHandle(item.tag, item.label);
                                setActiveScreen(item.tag);
                            }}
                            onMouseEnter={(e) => {
                                const img = images[`${item.iconHover}`];
                                if (img) e.currentTarget.querySelector("img").src = img;
                            }}
                            onMouseLeave={(e) => {
                                const img = images[`${item.icon}`];
                                if (img) e.currentTarget.querySelector("img").src = img;
                            }}
                        >
                            <img src={images[`${item.icon}`]} alt={item.label} className="menu-icon"/>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="bottom-section">
                    {(userRole === "tehnicar" || userRole === "poslovodja") && (
                        <div className="status-toggle">
                            <label>
                                <div className="status-label">
                                    <img src={statusIcon} alt="Status" className="status-icon"/>
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

                    <div className="bottom-buttons">
                        <button className="icon-btn" onClick={() => setShowPasswordForm(true)}>
                            <img src={keyIcon} alt="Promjena šifre" className="icon-img key-icon"/>
                            <span>Promjena šifre</span>
                        </button>
                        <button className="icon-btn" onClick={() => navigate('/')}>
                            <img src={logoutIcon} alt="Odjava" className="icon-img logout-icon"/>
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