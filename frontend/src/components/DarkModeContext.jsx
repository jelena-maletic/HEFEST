import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        document.body.setAttribute("data-theme", isDark ? "dark" : "light");
        localStorage.setItem("darkMode", String(isDark));
    }, [isDark]);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode") === "true";
        document.documentElement.setAttribute("data-theme", saved ? "dark" : "light");
        document.body.setAttribute("data-theme", saved ? "dark" : "light");
    }, []);

    const toggleDarkMode = () => setIsDark(prev => !prev);

    return (
        <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    return useContext(DarkModeContext);
}