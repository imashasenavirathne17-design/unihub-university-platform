import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";

const AppLayout = () => {
    const { user } = useContext(AuthContext);

    // Role-based logic for Sidebar/Navbar visibility
    // If no user is logged in, show a clean marketing layout (no platform shell)
    if (!user) {
        return (
            <main className="min-h-screen bg-white">
                <Outlet />
            </main>
        );
    }

    return (
        <div className="flex min-h-screen bg-unihub-section">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
