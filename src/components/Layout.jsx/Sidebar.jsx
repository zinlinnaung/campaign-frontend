import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu"; // Menu Icon for mobile
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false); // State to toggle drawer on mobile
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if the screen width is mobile size

  // Define the color scheme based on your dashboard theme
  const selectedColor = "#10B981"; // Green for selected items
  const hoverColor = "#16A34A"; // Slightly darker green for hover
  const textColor = "#F3F4F6"; // Light gray for text
  const sidebarBg = "#111827"; // Dark background for sidebar
  const headerBg = "#0f172a"; // Lighter background for header

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Account Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Mobile Hamburger Menu Icon */}
      {isMobile && (
        <IconButton
          edge="start"
          sx={{ color: textColor, position: "absolute", top: 10, left: 10 }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer for Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // Temporary for mobile, permanent for desktop
        open={isMobile ? open : true} // Drawer is controlled via state on mobile
        onClose={handleDrawerToggle} // Close on mobile when clicking outside
        sx={{
          width: 240,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            bgcolor: sidebarBg,
            color: textColor,
          },
        }}
        ModalProps={{
          keepMounted: true, // Keep the drawer mounted on mobile devices
        }}
      >
        {/* Logo / Title */}
        <Box
          sx={{
            p: 2,
            bgcolor: headerBg,
            textAlign: "center",
            borderBottom: "1px solid #2d3748",
          }}
        >
          <Typography variant="h6" color={textColor} fontWeight="bold">
            My Admin
          </Typography>
        </Box>

        {/* Menu List */}
        <List sx={{ mt: 2 }}>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem
              button
              key={text}
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: selectedColor, // Color for selected item
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold", // Bold text for selected item
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#fff", // Keep icon color white when selected
                  },
                },
                "&:hover": {
                  backgroundColor: hoverColor, // Hover color for menu items
                },
                "& .MuiListItemText-root": {
                  color: textColor, // Default text color
                },
              }}
            >
              <ListItemIcon sx={{ color: textColor }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
