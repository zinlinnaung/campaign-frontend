import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import Layout from "../components/Layout.jsx/Layout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingPage";
import Home from "../pages/Home";
import QrCodeGenerator from "../components/QrCodeGenerator";
import LoginPage from "../pages/LoginPage";
import ExcelUploadPage from "../components/upload/UploadPage";
import EnatDashboard from "../components/Enat/EnatDashboard";
import FerrovitDashboard from "../components/Ferrovit/FerrovitDashboard";

export const RouterComponent = () => {
  return (
    <Routes>
      {/* Redirect default path "/" to "/code" */}
      <Route path="/" element={<Navigate to="/code" replace />} />

      {/* Wrap all dashboard routes in Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route index element={<DashboardPage />} /> {/* Admin Dashboard */}
        <Route path="settings" element={<SettingsPage />} />{" "}
        <Route path="upload" element={<ExcelUploadPage />} />{" "}
        <Route path="enat" element={<EnatDashboard />} />
        <Route path="farrovit" element={<FerrovitDashboard />} />
        {/* Upload Page */}
        {/* Add more routes here */}
      </Route>

      <Route path="/code" element={<Home />} />
      <Route path="/qr" element={<QrCodeGenerator />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
