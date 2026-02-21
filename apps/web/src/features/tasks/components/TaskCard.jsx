import React from "react";
import EntityCard from "@/components/ui/EntityCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import RateReviewIcon from '@mui/icons-material/RateReview'; 

const STATUS_CONFIG = {
  0: { label: 'To Do', key: 'todo', icon: RadioButtonUncheckedIcon },
  1: { label: 'In Progress', key: 'in-progress', icon: AutorenewIcon },
  2: { label: 'Review', key: 'review', icon: RateReviewIcon }, 
  3: { label: 'Done', key: 'done', icon: CheckCircleIcon },
  // На випадок, якщо бекенд віддає рядки
  todo: { label: "To Do", key: "todo", icon: RadioButtonUncheckedIcon },
  in_progress: {
    label: "In Progress",
    key: "in-progress",
    icon: AutorenewIcon,
  },
  review: { label: 'Review', key: 'review', icon: RateReviewIcon },
  done: { label: "Done", key: "done", icon: CheckCircleIcon },
};


const PRIORITY_COLORS = {
  0: 'success.main',
  1: 'warning.main',
  2: 'error.main',
  
  'low': 'success.main',
  'medium': 'warning.main',
  'high': 'error.main'
};

const TaskCard = ({ task, onClick, onEdit, onDelete }) => {
  const { title, key, status, priority, deadline, assignee, creator } = task;

  const priorityKey = typeof priority === 'string' ? priority.toLowerCase() : priority;
  const priorityColor = PRIORITY_COLORS[priorityKey] || 'text.secondary';

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG[0];

  const formattedDate = deadline
    ? new Date(deadline).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "No deadline";

  const displayUser = assignee || creator;
  const userAvatar = {
    name: displayUser?.email || "Unassigned",
    color: assignee ? "primary.main" : "grey.400",
  };

  const cardActions = [
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }
        onEdit(task);
      },
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (e) => {
        e?.stopPropagation?.();
        onDelete(task.id);
      },
      color: "error.main",
    },
  ];

  const PriorityIcon = (props) => (
    <FlagIcon
      {...props} 
      sx={{ 
        ...props.sx, 
        color: priorityColor
      }}
    />
  );

  return (
    <EntityCard
      title={title}
      itemKey={key} 
      icon={PriorityIcon} 
      status={statusInfo.key} 
      statusLabel={statusInfo.label} 
      userAvatar={userAvatar}
      date={formattedDate}
      actions={cardActions}
      onClick={() => onClick(task)}
    />
  );
};

export default TaskCard;

