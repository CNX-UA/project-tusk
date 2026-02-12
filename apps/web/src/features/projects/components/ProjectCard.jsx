import React from 'react';
import { useNavigate } from 'react-router-dom';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EntityCard from '@/components/ui/EntityCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';



const ProjectCard = ({ project, onEdit, onDelete }) => {
   
    const projectActions = [
    { 
        label: 'Edit', 
        icon: <EditIcon fontSize="small" />, 
        onClick: onEdit
    },
    { 
        label: 'Delete', 
        icon: <DeleteIcon fontSize="small" />, 
        onClick: onDelete,
        color: 'error.main' 
    },
    ];
   
    const { id, title, key, status, created_at, user, team, description, parent_id, is_folder } = project;
    const formattedDate =  created_at ? new Date(created_at).toLocaleDateString(undefined, 
        { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';    

    const ownerName = team ? team.name : (user?.email || 'Personal');
    const ownerColor = team ? 'secondary.main' : 'primary.main';

    const navigate = useNavigate();

    const isRoot = !parent_id;
    const isFolderType = isRoot || is_folder;
    
    const TypeIcon = isFolderType ? FolderOpenIcon : DashboardIcon;
    const typeLabel = isFolderType ? 'Folder' : 'Board';

    return (
        <EntityCard
            title={title}
            itemKey={key}
            icon={FolderOpenIcon}
            status={status}
            userAvatar={{ name: ownerName, color: ownerColor }}
            date={formattedDate}
            actions={projectActions}
            onClick={() => navigate(`/projects/${id}`)}
        > 
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* <Chip
                        label={typeLabel} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                            height: 20, 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            color: 'text.secondary',
                            borderColor: 'divider'
                        }}
                    /> */}
                    {description && (
                        <Typography 
                        variant="caption" 
                        color="text.secondary"
                        noWrap 
                        sx={{ maxWidth: '180px' }}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
            </Box>
        </EntityCard>
    );
};
export default ProjectCard;