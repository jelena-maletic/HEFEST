import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../auth/authService";
import { saveAuth } from "../../auth/auth";
import "./Login.css";
import hefestLogo from "../../assets/hefest-logo.png";
import loginIcon from "../../assets/login-icon.png";
import lockIcon from "../../assets/lock-icon.png";
import usernameIcon from "../../assets/user.svg";
import eyeOpen from "../../assets/eye.svg";
import eyeClosed from "../../assets/eye-off.svg";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password");
            return;
        }

        try {
            const res = await login(username, password);
            const { token, role } = res.data;
            saveAuth(token, username, role);
            switch (role) {
                case "ROLE_DIREKTOR":
                    navigate("/direktor/dashboard");
                    break;
                case "ROLE_MAGACIONER":
                    navigate("/magacioner/dashboard");
                    break;
                case "ROLE_TEHNICAR":
                    navigate("/tehnicar/dashboard");
                    break;
                case "ROLE_POSLOVODJA":
                    navigate("/poslovodja/dashboard");
                    break;
                case "ROLE_KNJIGOVODJA":
                    navigate("/knjigovodja/dashboard");
                    break;
                default:
                    setError("Unknown role — access denied");
                    sessionStorage.clear();
                    break;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid username or password");
        }
    };


    return (
        <div className="login-container">
            <img src={hefestLogo} alt="Hefest logo" className="logo-icon" />
            <h2 className="title">Sign in</h2>

            <img src={loginIcon} alt="User icon" className="login-icon" />

            <div className="input-group">
                <img src={usernameIcon} alt="User" className="input-icon" />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}

                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <img src={lockIcon} alt="Lock" className="input-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onDrop={(e) => e.preventDefault()}
                        onDragOver={(e) => e.preventDefault()}
                    />
                    <img
                        className="toggle-password"
                        src={showPassword ? eyeClosed : eyeOpen}
                        alt={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="login-button" type="submit">Log in</button>
                {/*
                <p className="forgot-password">Forgot password?</p>
                */}
            </form>
        </div>
    );
}

export default Login;