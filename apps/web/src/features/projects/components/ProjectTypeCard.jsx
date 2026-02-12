import React from "react";
import {
  Card,
  CardActionArea,
  Typography,
  Stack,
  alpha,
  Box,
} from "@mui/material";

const ProjectTypeCard = ({ label, icon: Icon, value, selected, onClick }) => (
  <Card 
    variant="outlined" 
    sx={{ 
      borderColor: selected ? 'primary.main' : 'divider',
      bgcolor: selected ? alpha('#1976d2', 0.04) : 'transparent',
      transition: 'all 0.2s',
    }}
  >
    <CardActionArea onClick={() => onClick(value)} sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {Icon ? (
          <Icon color={selected ? "primary" : "action"} />
        ) : (
          <Box sx={{ width: 24, height: 24 }} />
        )}
        <Typography 
          fontWeight={selected ? 600 : 400} 
          color={selected ? "primary.main" : "text.primary"}
          variant="body2"
        >
          {label}
        </Typography>
      </Stack>
    </CardActionArea>
  </Card>
);
export default ProjectTypeCard;