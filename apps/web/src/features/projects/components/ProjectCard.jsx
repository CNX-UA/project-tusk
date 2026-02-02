import React from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EntityCard from '@/components/ui/EntityCard';

const ProjectCard = ({ project, onClick }) => {
    const { title, key, status, created_at, user, team } = project;

    const formattedDate =  created_at ? new Date(created_at).toLocaleDateString(undefined, 
        { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';    

    const ownerName = team ? team.name : (user?.email || 'Personal');
    const ownerColor = team ? 'secondary.main' : 'primary.main';

    return (
        <EntityCard
            title={title}
            itemKey={key}
            icon={FolderOpenIcon}
            status={status}
            userAvatar={{ name: ownerName, color: ownerColor }}
            date={formattedDate}
            onClick={() => onClick && onClick(project)}
        />
    );
};
export default ProjectCard;