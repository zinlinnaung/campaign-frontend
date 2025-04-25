import React from "react";
import { Routes, Route } from "react-router-dom"; // Import necessary routing components
import Layout from "../components/Layout.jsx/Layout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingPage";
import Home from "../pages/Home";

export const RouterComponent = () => {
  return (
    <Routes>
      {/* Wrap all routes in the Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<DashboardPage />} /> {/* Admin Dashboard */}
        <Route path="settings" element={<SettingsPage />} />{" "}
        {/* Add more routes here */}
      </Route>
      <Route path="code" element={<Home />} /> {/* Account Settings */}
    </Routes>
  );
};
