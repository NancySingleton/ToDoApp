'use client';

import { useTasks } from '@/context/TaskContext';
import { Task } from './Task';
import { Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface TaskListProps {
  date: string;
  onTaskClick?: (taskId: string) => void;
}

export function TaskList({ date, onTaskClick }: TaskListProps) {
  const { getTasksForDate, reorderTasks } = useTasks();
  const tasks = getTasksForDate(date);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskIds = tasks.map(task => task.id);
    const [removed] = taskIds.splice(result.source.index, 1);
    taskIds.splice(result.destination.index, 0, removed);

    reorderTasks(date, taskIds);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={date}>
        {(provided: DroppableProvided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 100,
              padding: 1,
            }}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}
              >
                {(provided: DraggableProvided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                      task={task}
                      onClick={() => onTaskClick?.(task.id)}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
} 