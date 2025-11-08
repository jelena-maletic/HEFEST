/* import './App.css'*/
import Login from "./pages/Login/Login.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import DirektorDashboard from "./pages/Dashboards/DirektorDashboard.jsx";
import MagacionerDashboard from "./pages/Dashboards/MagacionerDashboard.jsx";
import TehnicarDashboard from "./pages/Dashboards/TehnicarDashboard.jsx";
import PoslovodjaDashboard from "./pages/Dashboards/PoslovodjaDashboard.jsx";
import KnjigovodjaDashboard from "./pages/Dashboards/KnjigovodjaDashboard.jsx";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/direktor/dashboard" element={
                    <ProtectedRoute allowedRoles={["ROLE_DIREKTOR"]}>
                        <DirektorDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/magacioner/dashboard" element={
                    <ProtectedRoute allowedRoles={["ROLE_MAGACIONER"]}>
                        <MagacionerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/tehnicar/dashboard" element={
                    <ProtectedRoute allowedRoles={["ROLE_TEHNICAR"]}>
                        <TehnicarDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/poslovodja/dashboard" element={
                    <ProtectedRoute allowedRoles={["ROLE_POSLOVODJA"]}>
                        <PoslovodjaDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/knjigovodja/dashboard" element={
                    <ProtectedRoute allowedRoles={["ROLE_KNJIGOVODJA"]}>
                        <KnjigovodjaDashboard />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
