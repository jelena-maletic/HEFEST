import { useState } from "react";
import "./Login.css";
import hefestLogo from "../../assets/hefest-logo.png";
import loginIcon from "../../assets/login-icon.png";
import lockIcon from "../../assets/lock-icon.png";
import usernameIcon from "../../assets/user.svg";
import eyeOpen from "../../assets/eye.svg";
import eyeClosed from "../../assets/eye-off.svg";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-container">
            <img src={hefestLogo} alt="Hefest logo" className="logo" />
            <h2 className="title">Sign in</h2>

            <img src={loginIcon} alt="User icon" className="login-icon" />

            <div className="input-group">
                <img src={usernameIcon} alt="User" className="input-icon" />
                <input
                    type="text"
                    placeholder="Username"
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}

                />
            </div>

            <div className="input-group">
                <img src={lockIcon} alt="Lock" className="input-icon" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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

            <button className="login-button">Log in</button>
            {/*
            <p className="forgot-password">Forgot password?</p>
            */}
        </div>
    );
}

export default Login;