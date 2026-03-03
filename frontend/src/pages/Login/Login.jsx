import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../auth/authService";
import { saveAuth } from "../../auth/auth";
import "./Login.css";
import hefestLogo from "../../assets/hefest-logo.svg";
import loginIcon from "../../assets/login-icon.png";
import lockIcon from "../../assets/lock-icon.png";
import usernameIcon from "../../assets/user.svg";
import eyeOpen from "../../assets/eye.svg";
import eyeClosed from "../../assets/eye-off.svg";

function Login({roleHandle}) {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
            // Bekend vraća LoginResponse sa poljima: token, username, role
            const { token, role, username: returnedUsername } = res.data;

            // Čuvamo u sessionStorage
            saveAuth(token, returnedUsername, role);

            // Preusmjeravanje na osnovu uloge iz bekenda
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
            console.error("Login error object:", err); // Log this to see the real structure
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || "Neispravno korisničko ime ili lozinka";
            setError(errorMessage);
        }
    };


    return (
        <div className="login-container">
            <img src={hefestLogo} alt="Hefest logo" className="logo-icon" />
            <h2 className="title">Sign in</h2>

            <img src={loginIcon} alt="User icon" className="login-icon" />

            <form onSubmit={handleSubmit}>
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

                {error && <p className="error-message">{`${error}`}</p>}

                <button className="login-button" type="submit">Log in</button>
            </form>
        </div>
    );
}

export default Login;