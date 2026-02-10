import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  Avatar,
} from "@mui/material";

const STATUS_COLORS = {
  active: "success",
  completed: "info",
  archived: "default",
  todo: "warning",
  "in-progress": "primary",
  done: "success",
};

export const EntityCard = ({
  title,
  itemKey,
  icon: Icon,
  status,
  statusLabel,
  userAvatar,
  date,
  onClick,
}) => {
  const statusColor = STATUS_COLORS[status?.toLowerCase()] || "default";
  const displayStatus = statusLabel || status || "Unknown";
  const avatarLetter = userAvatar?.name
    ? userAvatar.name.charAt(0).toUpperCase()
    : "?";

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "all 0.2s",
        border: "1px solid transparent",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          borderColor: "primary.light",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                color: "text.secondary",
                bgcolor: "action.hover",
                px: 1,
                py: 0.5,
                borderRadius: 1.5,
              }}
            >
              {Icon && <Icon sx={{ fontSize: 20 }} />}
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {itemKey}
              </Typography>
            </Box>

            <Chip
              label={displayStatus}
              color={statusColor}
              size="small"
              sx={{
                fontWeight: 600,
                height: 24,
                borderWidth: 1.5,
                fontSize: "0.7rem",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 2,
              flexGrow: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt="auto"
            width="100%"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.75rem",
                  bgcolor: userAvatar?.color || "primary.main",
                }}
              >
                {avatarLetter}
              </Avatar>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                noWrap
                sx={{ maxWidth: 100 }}
              >
                {userAvatar?.name || "Unknown"}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
                gap: 0.5,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{date || "N/A"}</Typography>
            </Box>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
};
