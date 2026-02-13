import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer, List,  ListItem,  ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, Avatar,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupsIcon from '@mui/icons-material/Groups';

import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import LogoutButton from "@/features/auth/components/LogoutButton";
// import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const drawerWidth = 240;

const Aside = ({ toggleColorMode, mode, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // const { data: user, isLoading } = useCurrentUser();

  const menuItems = [
    { text: "Projects", icon: <DashboardRoundedIcon />, path: "/projects" },
    { text: "Tasks", icon: <AssignmentRoundedIcon />, path: "/tasks" },
    { text: "Teams", icon: <GroupsIcon />, path: "/teams" },
    { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },

  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: "primary.main", ml: 1 }}
        >
          Project Tusk
        </Typography>
          <ThemeSwitcher mode={mode} toggleColorMode={toggleColorMode} />
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive} 
                onClick={() => navigate(item.path)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "primary.links",
                    color: "primary.dark",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "&:hover": { bgcolor: "primary.light" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            mb: 1,
            borderRadius: "12px",
            bgcolor: "action.hover",
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "14px" }}>
            {/* {user?.email?.charAt(0).toUpperCase()} */}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography>
              'User'
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", noWrap: true }}
            >?</Typography>
          </Box>
        </Box>

        <LogoutButton onLogout={onLogout} />
      </Box>
    </Drawer>
  );
};

export default Aside;
