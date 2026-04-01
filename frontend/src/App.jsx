import './App.css'
import Login from "./pages/Login/Login.jsx";
import sidebarContents from "./data/sidebar-contents.json"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard/Dashboard.jsx";
import {useState} from "react";
import {NotificationProvider} from "./components/NotificationContext.jsx";
import {ConfigProvider} from 'antd';
import srRS from 'antd/locale/sr_RS';

function App() {
    const [role, setRole] = useState("def");
    const handleRole = (data) => {
        setRole(data)
    }

    return (
        <ConfigProvider
            locale={srRS}
            theme={{
                token: {
                    colorPrimary: '#475569',
                    colorTextBase: '#1e293b',
                    colorBgLayout: '#f8fafc',
                    colorBorder: '#e2e8f0',
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
                        boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                        colorBorderSecondary: '#f1f5f9',
                        borderRadiusLG: 10,
                    },
                    Input: {
                        activeBorderColor: '#64748b',
                        hoverBorderColor: '#94a3b8',
                        controlOutline: 'transparent',
                    }
                },
            }}
        >
            <NotificationProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login roleHandle={handleRole}/>}/>
                        <Route path="/dashboard" element={

                            <Dashboard sidebarContents={sidebarContents} role={role}/>

                        }/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </ConfigProvider>

    )
}

export default App
