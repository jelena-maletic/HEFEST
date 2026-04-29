import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../auth/authService";
import { saveAuth } from "../../auth/auth";
import "./Login.css";
import { useDarkMode } from "../../components/DarkModeContext.jsx";
import hefestLogo from "../../assets/hefest-logo.svg";
import loginIcon from "../../assets/login-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import usernameIcon from "../../assets/user.svg";
import eyeOpen from "../../assets/eye.svg";
import eyeClosed from "../../assets/eye-off.svg";
import hefestLogoInverted from "../../assets/hefest-logo-inverted.svg";
import loginIconInverted from "../../assets/login-icon-inverted.svg";
import lockIconInverted from "../../assets/lock-icon-inverted.svg";
import usernameIconInverted from "../../assets/user-inverted.svg";
import eyeOpenInverted from "../../assets/eye-inverted.svg";
import eyeClosedInverted from "../../assets/eye-off-inverted.svg";
import sunIcon from "../../assets/sun.svg";
import moonIcon from "../../assets/moon.svg";

function Login({roleHandle}) {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { isDark, toggleDarkMode } = useDarkMode();

    const logo        = isDark ? hefestLogoInverted  : hefestLogo;
    const profileImg  = isDark ? loginIconInverted   : loginIcon;
    const lockImg     = isDark ? lockIconInverted     : lockIcon;
    const userImg     = isDark ? usernameIconInverted : usernameIcon;
    const eyeOpenImg  = isDark ? eyeOpenInverted      : eyeOpen;
    const eyeClosedImg = isDark ? eyeClosedInverted   : eyeClosed;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            console.log("Please enter a valid username");
            setError("Molimo unesite korisničko ime i lozinku.");
            return;
        }

        try {
            const res = await login(username, password);
            const { token, role, username: returnedUsername, jmb } = res.data;

            saveAuth(token, returnedUsername, role, jmb);

            switch (role) {
                case "ROLE_DIREKTOR":
                    roleHandle("direktor");
                    navigate("/dashboard");
                    break;
                case "ROLE_MAGACIONER":
                    roleHandle("magacioner");
                    navigate("/dashboard");
                    break;
                case "ROLE_TEHNICAR":
                    roleHandle("tehnicar");
                    navigate("/dashboard");
                    break;
                case "ROLE_POSLOVODJA":
                    roleHandle("poslovodja");
                    navigate("/dashboard");
                    break;
                case "ROLE_KNJIGOVODJA":
                    roleHandle("knjigovodja");
                    navigate("/dashboard");
                    break;
                default:
                    setError("Nemate ovlaštenja za pristup.");
                    sessionStorage.clear();
                    break;
            }
        } catch (err) {
            console.error("Login error object:", err);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || "Neispravno korisničko ime ili lozinka";
            setError(errorMessage);
        }
    };


    return (
        <div className="login-page">
            <button
                className={`login-dark-toggle ${isDark ? "active" : ""}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
            >
                <div className="login-toggle-track">
                    <div className="login-toggle-slider"></div>
                    <img
                        src={isDark ? moonIcon : sunIcon}
                        alt={isDark ? "Dark" : "Light"}
                        className="login-toggle-icon"
                    />
                </div>
            </button>

            <div className="login-container">
                <img src={logo} alt="Hefest logo" className="logo-icon" />
                <h2 className="title">Dobrodošli!</h2>

                <img src={profileImg} alt="User icon" className="login-icon" />

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <img src={userImg} alt="User" className="input-icon" />
                        <input
                            type="text"
                            placeholder="Korisničko ime"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onDrop={(e) => e.preventDefault()}
                            onDragOver={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="input-group">
                        <img src={lockImg} alt="Lock" className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Lozinka"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onDrop={(e) => e.preventDefault()}
                            onDragOver={(e) => e.preventDefault()}
                        />
                        <img
                            className="toggle-password"
                            src={showPassword ? eyeClosedImg : eyeOpenImg}
                            alt={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    {error && <p className="error-message">{`${error}`}</p>}

                    <button className="login-button" type="submit">Prijavi se</button>
                </form>
            </div>
        </div>
    );
}

export default Login;