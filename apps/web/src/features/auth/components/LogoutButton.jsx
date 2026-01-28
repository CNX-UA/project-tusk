import React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const LogoutButton = ({ onLogout }) => {
    return (
        <ListItemButton onClick={onLogout}
        sx={{borderRadius: "12px",
        color: "error.main",
        mt: 1,
        "& .MuiListItemIcon-root": { color: "inherit" },
        "&:hover": { 
          bgcolor: "primary.light", 
        }}}>
            <ListItemIcon sx={{ minWidth:40}}>
                <LogoutRoundedIcon />
            </ListItemIcon>
            
            <ListItemText primary="Exit" />
        </ListItemButton>
    )
}

export default LogoutButton