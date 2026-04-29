import './App.css'
import Login from "./pages/Login/Login.jsx";
import sidebarContents from "./data/sidebar-contents.json"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard/Dashboard.jsx";
import {useState} from "react";
import {NotificationProvider} from "./components/NotificationContext.jsx";
import {DarkModeProvider, useDarkMode} from "./components/DarkModeContext.jsx";
import {ConfigProvider, theme as antTheme} from 'antd';
import srRS from 'antd/locale/sr_RS';

function AntThemeWrapper({ children }) {
    const { isDark } = useDarkMode();
    return (
        <ConfigProvider
            locale={srRS}
            theme={{
                algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#475569',
                    colorTextBase: isDark ? '#DDDDDD' : '#1e293b',
                    colorBgLayout: isDark ? '#232423' : '#f8fafc',
                    colorBorder: isDark ? '#5a5b5a' : '#e2e8f0',
                    borderRadius: 6,
                    fontFamily: 'Inter, sans-serif',
                },
                components: {
                    Button: {
                        boxShadow: 'none',
                        boxShadowSecondary: 'none',
                        boxShadowTertiary: 'none',
                        fontWeight: 500,
                        colorPrimaryHover: '#334155',
                        controlOutline: 'transparent',
                    },
                    Card: {
                        colorBgContainer: isDark ? '#2E2F2E' : '#ffffff',
                    },
                    Input: {
                        activeBorderColor: '#64748b',
                        hoverBorderColor: '#94a3b8',
                        controlOutline: 'transparent',
                    }
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}

function App() {
    const [role, setRole] = useState(sessionStorage.getItem("role") || "def");

    const handleRole = (data) => {
        setRole(data);
        sessionStorage.setItem("role", data);
    };

    return (
        <DarkModeProvider>
            <AntThemeWrapper>
                <NotificationProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login roleHandle={handleRole}/>}/>
                            <Route path="/dashboard" element={
                                role !== "def" ? (
                                    <Dashboard sidebarContents={sidebarContents} role={role}/>
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }/>
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </BrowserRouter>
                </NotificationProvider>
            </AntThemeWrapper>
        </DarkModeProvider>
    );
}


export default App
