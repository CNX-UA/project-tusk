import React, { useState, useMemo } from "react";

import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTeams, useTeamMutation } from "../hooks/useTeams";
import TeamCard from "./TeamCard";
import CreateTeamModal from "./CreateTeamModal";

const DEPARTMENT_LABELS = {
  general: "General",
  it: "IT & Engineering",
  marketing: "Marketing",
  sales: "Sales",
  hr: "Human Resources",
};

const TeamsDashboard = () => {
  const { data: teams, isLoading } = useTeams();
  const { deleteMutation } = useTeamMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupedTeams = useMemo(() => {
    if (!teams) return {};

    return teams.reduce((groups, team) => {
      const dept = team.department_type || "general";
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(team);
      return groups;
    }, {});
  }, [teams]);

  const activeDepartments = Object.keys(groupedTeams).sort();

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Teams
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organization structure by department
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          New Team
        </Button>
      </Box>

      {teams?.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary">
            No teams yet. Create one to get started.
          </Typography>
        </Box>
      )}

      {activeDepartments.map((dept) => (
        <Box key={dept} sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
            <Typography variant="h6" color="text.secondary" fontWeight="bold">
              {DEPARTMENT_LABELS[dept] || dept.toUpperCase()}
            </Typography>
            <Chip
              label={groupedTeams[dept].length}
              size="small"
              color="default"
              sx={{ borderRadius: 1, height: 20, minWidth: 20 }}
            />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Grid container spacing={3}>
            {groupedTeams[dept].map((team) => (
              <Grid item xs={12} sm={6} md={4} key={team.id}>
                <TeamCard
                  team={team}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <CreateTeamModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default TeamsDashboard;
