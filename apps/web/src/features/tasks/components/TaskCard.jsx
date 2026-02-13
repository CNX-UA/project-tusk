import React from 'react';
import EntityCard from '@/components/ui/EntityCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// Мапінг статусів (Backend enum -> Frontend display)
const STATUS_CONFIG = {
  0: { label: 'To Do', key: 'todo', icon: RadioButtonUncheckedIcon },
  1: { label: 'In Progress', key: 'in-progress', icon: AutorenewIcon },
  2: { label: 'Done', key: 'done', icon: CheckCircleIcon },
  // На випадок, якщо бекенд віддає рядки
  'todo': { label: 'To Do', key: 'todo', icon: RadioButtonUncheckedIcon },
  'in_progress': { label: 'In Progress', key: 'in-progress', icon: AutorenewIcon },
  'done': { label: 'Done', key: 'done', icon: CheckCircleIcon },
};

// Мапінг пріоритетів для кольору іконки
const PRIORITY_COLORS = {
  0: 'info.main',    // Low
  1: 'warning.main', // Medium
  2: 'error.main'    // High
};

const TaskCard = ({ task, onClick, onEdit, onDelete }) => {
  // Деструктуризація даних з TaskBlueprint
  const { 
    title, 
    key, 
    status, 
    priority, 
    deadline, 
    assignee, // Це UserBlueprint
    creator 
  } = task;

  // 1. Визначаємо статус
  // Якщо статус приходить невідомий, ставимо дефолтний
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG[0];

  // 2. Форматуємо дату (Deadline)
  const formattedDate = deadline 
    ? new Date(deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
    : 'No deadline';

  // 3. Визначаємо користувача (Assignee має пріоритет над Creator, або показуємо "Unassigned")
  const displayUser = assignee || creator;
  const userAvatar = {
    name: displayUser?.email || 'Unassigned',
    color: assignee ? 'primary.main' : 'grey.400' // Сірий, якщо ніхто не призначений
  };

  // 4. Дії меню
  const cardActions = [
    { 
      label: 'Edit', 
      icon: <EditIcon fontSize="small" />, 
      onClick: (e) => { e.stopPropagation(); onEdit(task); } 
    },
    { 
      label: 'Delete', 
      icon: <DeleteIcon fontSize="small" />, 
      onClick: (e) => { e.stopPropagation(); onDelete(task.id); }, 
      color: 'error.main' 
    }
  ];

  // 5. Динамічна іконка (Прапорець пріоритету)
  // Ми створюємо кастомний компонент іконки, щоб передати його в EntityCard
  const PriorityIcon = (props) => (
    <FlagIcon 
      {...props} 
      sx={{ 
        ...props.sx, 
        color: PRIORITY_COLORS[priority] || 'text.secondary' 
      }} 
    />
  );

  return (
    <EntityCard
      title={title}
      itemKey={key} // наприклад "WE-12"
      icon={PriorityIcon} // Показуємо пріоритет як головну іконку
      status={statusInfo.key} // 'todo', 'in-progress', 'done' (для кольору чіпа)
      statusLabel={statusInfo.label} // Текст на чіпі
      userAvatar={userAvatar}
      date={formattedDate}
      actions={cardActions}
      onClick={() => onClick(task)}
    />
  );
};

export default TaskCard;
// export default TaskCard