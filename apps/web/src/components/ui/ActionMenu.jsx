import React, {useState} from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ActionMenu  = ({ actions, icon: Icon = MoreVertIcon }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (e) => {
        if (e) e.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton 
            aria-label="more"
            aria-controls={open ? 'action-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            >
                <Icon fontSize="small" />
            </IconButton>

            <Menu id="action-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}  
            >
                {actions.map((action, index) => (
                    <MenuItem key={index}
                    onClick={() => {
                        action.onClick();
                        handleClose();
                    }}
                    disabled={action.disabled}
                    sx={{ color: action.color || 'inherit' }}
                    >
                        {action.icon && (
                            <ListItemIcon sx={{ color: action.color || 'inherit'}}>
                                {action.icon}
                            </ListItemIcon>
                            )}
                            <ListItemText>{action.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
export default ActionMenu;