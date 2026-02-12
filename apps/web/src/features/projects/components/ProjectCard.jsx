import React from 'react';
import { useNavigate } from 'react-router-dom';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EntityCard from '@/components/ui/EntityCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
   
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
   
    const { id, title, key, status, created_at, user, team } = project;
    const formattedDate =  created_at ? new Date(created_at).toLocaleDateString(undefined, 
        { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';    

    const ownerName = team ? team.name : (user?.email || 'Personal');
    const ownerColor = team ? 'secondary.main' : 'primary.main';

    const navigate = useNavigate();

    return (
        <EntityCard
            title={title}
            itemKey={key}
            icon={FolderOpenIcon}
            status={status}
            userAvatar={{ name: ownerName, color: ownerColor }}
            date={formattedDate}
            actions={projectActions}
            onClick={() => navigate(`/projects/${project.id}`)}
        />
    );
};
export default ProjectCard;