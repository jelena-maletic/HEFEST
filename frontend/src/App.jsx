import './App.css'
import Login from "./pages/Login/Login.jsx";
import sidebarContents from "./data/sidebar-contents.json"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard/Dashboard.jsx";
import {useState} from "react";
import {NotificationProvider} from "./components/NotificationContext.jsx";


function App() {
    const [role, setRole] = useState("def");
    const handleRole = (data) => {
        setRole(data)
    }

    return(
        <NotificationProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login roleHandle={handleRole} />} />
                <Route path="/dashboard" element={

                        <Dashboard sidebarContents={sidebarContents} role={role}/>

                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
        </NotificationProvider>


    )
}

export default App
