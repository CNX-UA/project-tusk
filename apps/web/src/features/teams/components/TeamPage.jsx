import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, CircularProgress, Grid, Paper, 
    Avatar, IconButton, Button, TextField, Chip, Divider, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useTeam, useTeamMembers, useTeamMutation } from '../hooks/useTeams';

const ROLE_COLORS = {
    manager: 'primary',
    member: 'default'
};

const TeamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    
    const { data: team, isLoading: teamLoading, error: teamError } = useTeam(id);
    const { data: members, isLoading: membersLoading } = useTeamMembers(id);
    const { addMemberMutation, removeMemberMutation } = useTeamMutation();

    console.log("Team ID:", id);
    console.log("Team Data:", team);
    console.log("Team Error:", teamError);
    console.log("Is Loading:", teamLoading);

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        
        addMemberMutation.mutate(
            { teamId: id, email: email.trim(), role: 'member' }, 
            {
                onSuccess: () => setEmail('') // Очистити поле
            }
        );
    };

    if (teamLoading || membersLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!team) return <Typography variant="h6" align="center" mt={4}>Team not found</Typography>;

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Навігація назад */}
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/teams')} 
                sx={{ mb: 2, color: 'text.secondary' }}
            >
                Back to Teams
            </Button>
            
            {/* Заголовок */}
            <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {team.name}
                </Typography>
                <Chip 
                    label={`${team.department_type?.toUpperCase()} Department`} 
                    size="small" 
                    variant="outlined" 
                />
            </Box>

            <Grid container spacing={4}>
                {/* ЛІВА КОЛОНКА: Список учасників */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Team Members
                        </Typography>
                        <Chip label={members?.length || 0} size="small" />
                    </Box>
                    
                    <Stack spacing={2}>
                        {members?.map((membership) => {
                            const isManager = membership.role === 'manager';
                            return (
                                <Paper 
                                    key={membership.id}
                                    elevation={0}
                                    sx={{ 
                                        p: 2, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2, 
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: isManager ? 'primary.main' : 'grey.500' }}>
                                        {membership.user.first_name?.[0] || membership.user.email[0].toUpperCase()}
                                    </Avatar>
                                    
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {membership.user.first_name 
                                                    ? `${membership.user.first_name} ${membership.user.last_name || ''}` 
                                                    : 'User'}
                                            </Typography>
                                            {isManager && (
                                                <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 16 }} titleAccess="Manager" />
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {membership.user.email}
                                        </Typography>
                                    </Box>

                                    {/* Кнопка видалення (доступна якщо це не єдиний менеджер) */}
                                    <IconButton 
                                        size="small" 
                                        color="error"
                                        onClick={() => removeMemberMutation.mutate({ teamId: id, membershipId: membership.id })}
                                        disabled={removeMemberMutation.isPending}
                                        sx={{ 
                                            opacity: 0.6,
                                            '&:hover': { opacity: 1, bgcolor: 'error.lighter' }
                                        }}
                                    >
                                        <PersonRemoveIcon />
                                    </IconButton>
                                </Paper>
                            );
                        })}
                        
                        {members?.length === 0 && (
                            <Typography color="text.secondary" fontStyle="italic">
                                No members in this team yet.
                            </Typography>
                        )}
                    </Stack>
                </Grid>

                {/* ПРАВА КОЛОНКА: Форма додавання */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            position: 'sticky', 
                            top: 24 
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Add Member
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Invite a colleague by entering their email address. They must be registered in the system.
                        </Typography>
                        
                        <form onSubmit={handleAddMember}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                placeholder="name@company.com"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                                disabled={addMemberMutation.isPending}
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                size="large"
                                startIcon={<PersonAddIcon />}
                                disabled={!email || addMemberMutation.isPending}
                            >
                                {addMemberMutation.isPending ? 'Adding...' : 'Add to Team'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeamPage;