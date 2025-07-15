import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import Layout from "../components/Layout.jsx/Layout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingPage";
import Home from "../pages/Home";
import QrCodeGenerator from "../components/QrCodeGenerator";
import LoginPage from "../pages/LoginPage";
import CircleCodeImage from "../components/CircleCodeImage";

export const RouterComponent = () => {
  return (
    <Routes>
      {/* Redirect default path "/" to "/code" */}
      <Route path="/" element={<Navigate to="/code" replace />} />

      {/* Wrap all dashboard routes in Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/code" element={<Home />} />
      <Route path="/qr" element={<CircleCodeImage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
