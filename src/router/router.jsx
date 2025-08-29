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
import GlucomealDashboard from "../components/Glucomeal/GlucomealDashboard";

export const RouterComponent = () => {
  return (
    <Routes>
      {/* Redirect default path "/" to "/code" */}
      <Route path="/" element={<Navigate to="/qr" replace />} />

      {/* Wrap all dashboard routes in Layout */}

      <Route path="/qr" element={<QrCodeGenerator />} />
    </Routes>
  );
};
