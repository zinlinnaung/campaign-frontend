// Sidebar.jsx
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
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import { Link, useLocation } from "react-router-dom";

export const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1090px)");

  const selectedColor = "#10B981";
  const hoverColor = "#16A34A";
  const textColor = "#F3F4F6";
  const sidebarBg = "linear-gradient(to top, #5db6be, #34609e)";
  const headerBg = "#0f172a";

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Upload", icon: <UploadFileIcon />, path: "/dashboard/upload" },

    { text: "Enat", icon: <BubbleChartIcon />, path: "/dashboard/enat" },
    {
      text: "Ferrovit",
      icon: <BubbleChartIcon />,
      path: "/dashboard/ferrovit",
    },
    // {
    //   text: "Account Settings",
    //   icon: <SettingsIcon />,
    //   path: "/dashboard/settings",
    // },
  ];

  const handleDrawerToggle = () => setOpen(!open);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo / Title */}
      <Box
        sx={{
          p: 2,
          // bgcolor: headerBg,
          textAlign: "center",
          borderBottom: "1px solid #2d3748",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color={textColor}>
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
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              "&.Mui-selected": {
                backgroundColor: selectedColor,
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                },
                "& .MuiListItemIcon-root": {
                  color: "#fff",
                },
              },
              "&:hover": {
                backgroundColor: hoverColor,
              },
              "& .MuiListItemText-root": {
                color: textColor,
              },
            }}
          >
            <ListItemIcon sx={{ color: textColor }}>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            color: textColor,
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1301,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: sidebarBg,
            color: textColor,
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
