import React from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import DeleteIcon from '@mui/icons-material/Delete';
import EntityCard from '@/components/ui/EntityCard';

const DEPARTMENT_COLORS = {
    it: 'info',
    marketing: 'warning',
    sales: 'success',
    hr: 'error',
    general: 'default'
};

const TeamCard = ({ team, onDelete }) => {
    const navigate = useNavigate();
    const { id, name, department_type, users_count, created_at } = team;
    
    const formattedDate = created_at ? new Date(created_at).toLocaleDateString() : "N/A";

    const teamActions = [
        {
            label: 'Delete Team',
            icon: <DeleteIcon fontSize='small' />,
            onclick: (e) => {e.stopPropagation(); onDelete(id); },
            color: 'error.main',
        },
    ];

    return (
        <EntityCard 
        title={name}
        itemKey={`${users_count} members`}
        icon={GroupsIcon}
        status={department_type}
        statusLabel={department_type.toUpperCase()}
        userAvatar={{ name: name, color: 'secondary.main' }}
        date={formattedDate}
        actions={teamActions}
        onClick={() => navigate(`/teams/${id}`)}
        />
    )
};

export default TeamCard;