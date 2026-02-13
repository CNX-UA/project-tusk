import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Typography, Paper, Stack } from "@mui/material";
import TaskCard from "./TaskCard";
import { useTaskMutation } from "../hooks/useTaskMutation";

const COLUMNS = {
  todo: { title: "To Do", status: 0, color: "#f5f5f5", borderColor: "#e0e0e0" },
  in_progress: {
    title: "In Progress",
    status: 1,
    color: "#e3f2fd",
    borderColor: "#90caf9",
  },
  review: {
    title: "Review",
    status: 2,
    color: "#fff8e1",
    borderColor: "#ffe082",
  },
  done: { title: "Done", status: 3, color: "#e8f5e9", borderColor: "#a5d6a7" },
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const KanbanBoard = ({ tasks, projectId, onEdit, onDelete }) => {
  const { updateMutation } = useTaskMutation();
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    const sortedTasks = [...tasks].sort(
      (a, b) => (a.position || 0) - (b.position || 0),
    );

    const grouped = { todo: [], in_progress: [], review: [], done: [] };
    sortedTasks.forEach((task) => {
      let key = "todo";
      const s = task.status;

      if (s === 0 || s === "todo") key = "todo";
      if (s === 1 || s === "in_progress") key = "in_progress";
      if (s === 2 || s === "review") key = "review";
      if (s === 3 || s === "done") key = "done";

      if (!grouped[key]) key = "todo";

      grouped[key].push(task);
    });
    setColumns(grouped);
  }, [tasks]);

const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumnKey = source.droppableId;
    const destColumnKey = destination.droppableId;
    
    // 1. Отримуємо задачу з поточної колонки
    const taskToMove = columns[sourceColumnKey][source.index];

    let newAssigneeId = taskToMove.assignee_id;
    let newAssigneeObj = taskToMove.assignee;

    // 2. Логіка "Взяти в роботу"
    if (destColumnKey === "in_progress" && sourceColumnKey !== "in_progress") {
      const currentUser = getCurrentUser();

      if (currentUser && taskToMove.assignee_id !== currentUser.id) {
        const confirmAssign = window.confirm(
          `Move "${taskToMove.title}" to In Progress and assign it to yourself?`
        );

        if (!confirmAssign) {
          return;
        }

        newAssigneeId = currentUser.id;
        newAssigneeObj = currentUser; 
      }
    }

    const newColumns = { ...columns };
    const sourceList = [...newColumns[source.droppableId]]; // Копіюємо масив
    const destList = source.droppableId === destination.droppableId 
        ? sourceList 
        : [...newColumns[destination.droppableId]]; // Копіюємо масив

    // Видаляємо зі старої колонки
    const [movedTask] = sourceList.splice(source.index, 1);

    // 3. !!! ВАЖЛИВЕ ВИПРАВЛЕННЯ ТУТ !!!
    // Оновлюємо дані об'єкта для локального стейту (UI), щоб аватар змінився миттєво
    const updatedTask = {
        ...movedTask,
        status: COLUMNS[destination.droppableId].status,
        assignee_id: newAssigneeId,
        assignee: newAssigneeObj // Це оновить аватарку відразу
    };

    // Вставляємо в нову колонку
    destList.splice(destination.index, 0, updatedTask);

    // Оновлюємо стейт
    newColumns[source.droppableId] = sourceList;
    if (source.droppableId !== destination.droppableId) {
        newColumns[destination.droppableId] = destList;
    }
    setColumns(newColumns);

    // 4. Відправка на сервер
    const newPosition = destination.index + 1;
    updateMutation.mutate({
      id: movedTask.id,
      taskData: {
        status: updatedTask.status,
        position: newPosition,
        assignee_id: newAssigneeId,
      },
    });
  };
  if (!isBrowser) {
    return null; // Або <CircularProgress />
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
        sx={{ height: "100%", overflowX: "auto", pb: 2 }}
      >
        {Object.entries(COLUMNS).map(([columnId, columnConfig]) => (
          <Box
            key={columnId}
            sx={{
              width: { xs: "100%", md: "25%" },
              minWidth: 200,
            }}
          >
            <Box
              sx={{
                p: 2,
                mb: 1,
                bgcolor: columnConfig.color,
                borderRadius: 2,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {columnConfig.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ bgcolor: "rgba(0,0,0,0.1)", px: 1, borderRadius: 1 }}
              >
                {columns[columnId]?.length || 0}
              </Typography>
            </Box>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    p: 1,
                    minHeight: 400,
                    bgcolor: snapshot.isDraggingOver
                      ? "action.hover"
                      : "background.default",
                    transition: "background-color 0.2s ease",
                    border: "1px dashed #ccc",
                  }}
                  elevation={0}
                >
                  {columns[columnId]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 2,
                            ...provided.draggableProps.style,
                            // --- МАГІЯ ТУТ ---
                            // Ми вимикаємо кліки на області контенту картки.
                            // Тепер подія кліку "проходить наскрізь" до нашого Box, який і запускає перетягування.
                            "& .MuiCardActionArea-root": {
                              pointerEvents: "none",
                            },
                            // Гарантуємо, що меню (яке має клас MuiIconButton-root або лежить окремо) залишиться клікабельним
                            // Оскільки у вашому коді меню лежить ПОВЕРХ ActionArea (absolute), воно працюватиме і так.
                          }}
                        >
                          <TaskCard
                            task={task}
                            // onClick тут можна прибрати, бо через pointerEvents: none він все одно не спрацює на тілі картки.
                            // Редагування буде працювати через меню (олівчик).
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          </Box>
        ))}
      </Stack>
    </DragDropContext>
  );
};

export default KanbanBoard;
