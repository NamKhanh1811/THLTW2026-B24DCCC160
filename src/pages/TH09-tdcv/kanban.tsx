import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';

const KEY = 'TASKS_KANBAN';

type TaskStatus = 'todo' | 'inprogress' | 'done';

type Priority = 'high' | 'medium' | 'low';

type Task = {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  deadline?: string;
  priority: Priority;
  tags?: string[];
};

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = (): Task[] => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  };

  const saveTasks = (data: Task[]) => {
    localStorage.setItem(KEY, JSON.stringify(data));
    setTasks(data);
  };

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const updated = tasks.map((t: Task) =>
      t.id === draggableId
        ? {
            ...t,
            status: destination.droppableId as TaskStatus,
          }
        : t
    );

    saveTasks(updated);
  };

  const renderColumn = (status: TaskStatus, title: string) => {
    const filtered = tasks.filter(
      (t: Task) => t.status === status
    );

    return (
      <Col span={8} key={status}>
        <h3>{title}</h3>

        <Droppable droppableId={status}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: 400,
                background: '#f5f5f5',
                padding: 8,
                borderRadius: 6,
              }}
            >
              {filtered.map((task: Task, index: number) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: 8,
                        cursor: 'grab',
                      }}
                    >
                      <b>{task.name}</b>
                      <p style={{ margin: 0 }}>
                        {task.description}
                      </p>
                    </Card>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Col>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Kanban Board</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {renderColumn('todo', 'Cần làm')}
          {renderColumn('inprogress', 'Đang làm')}
          {renderColumn('done', 'Hoàn thành')}
        </Row>
      </DragDropContext>
    </div>
  );
}