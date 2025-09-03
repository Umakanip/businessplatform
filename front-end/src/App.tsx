import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import "./App.css";

// Components
import SidebarInv from "./components/Sidebar/SidebarInv";
import SidebarIh from "./components/Sidebar/SidebarIh";
import AuthContainer from "./components/Pages/AuthContainer";
import InvitationsList from "./components/Pages/profile";
import PaymentPage from "./components/Pages/Payment";
import ConnectPage from "./components/Pages/Connect";
import Pricing from "./components/Pages/Pricing";

// Pages
import Home from "./components/Pages/Home";

// Idea Holder
import IdeaHolderDashboard from "./pages/ideaHolder/Dashboard";
import Connections from "./pages/ideaHolder/Connections";
import Subscription from "./pages/ideaHolder/Subscription";
import NotificationsIH from "./pages/ideaHolder/Notifications";
import ProfileIH from "./pages/ideaHolder/Profile";
import SettingsIH from "./pages/ideaHolder/Settings";

// Investor
import InvestorDashboard from "./pages/investor/Dashboard";
import Investments from "./pages/investor/Investments";
import NotificationsInv from "./pages/investor/Notifications";
import ProfileInv from "./pages/investor/Profile";
import SettingsInv from "./pages/investor/Settings";

const App: React.FC = () => {
  // ⚡ Later, get this from auth/login state
  const role: "idea-holder" | "investor" = "idea-holder";

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthContainer />} />
        <Route path="/invitation" element={<InvitationsList />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/subscription" element={<Pricing />} />

        {/* Idea Holder Layout with Nested Routes */}
        <Route path="/ih" element={<MainLayout role="idea-holder" />}>
          <Route path="dashboard" element={<IdeaHolderDashboard />} />
          <Route path="/ih/subscription" element={<Subscription />} />
          <Route path="connections" element={<Connections />} />
          <Route path="notifications" element={<NotificationsIH />} />
          <Route path="profile" element={<ProfileIH />} />
          <Route path="settings" element={<SettingsIH />} />
        </Route>

        {/* Investor Layout with Nested Routes */}
        <Route path="/inv" element={<MainLayout role="investor" />}>
          <Route path="dashboard" element={<InvestorDashboard />} />
          <Route path="investments" element={<Investments />} />
          <Route path="notifications" element={<NotificationsInv />} />
          <Route path="profile" element={<ProfileInv />} />
          <Route path="settings" element={<SettingsInv />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-gray-700 text-center mt-20 text-3xl">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
};

// MainLayout Component with Outlet
const MainLayout: React.FC<{ role: "idea-holder" | "investor" }> = ({ role }) => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar based on role */}
      {role === "investor" ? <SidebarInv /> : <SidebarIh />}

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        <Outlet /> {/* This is where nested route components will render */}
      </div>
    </div>
  );
};

export default App;