import { Card, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = (): Task[] => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Lỗi parse localStorage:', err);
      return [];
    }
  };

  useEffect(() => {
    setTasks(getTasks());
  }, []);


  const total = tasks.length;

  const done = tasks.filter((t: Task) => t.status === 'done').length;

  const overdue = tasks.filter((t: Task) => {
    if (!t.deadline) return false;

    return (
      dayjs(t.deadline).isBefore(dayjs(), 'day') &&
      t.status !== 'done'
    );
  }).length;


  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <p>Tổng số task</p>
            <h1>{total}</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <p>Đã hoàn thành</p>
            <h1 style={{ color: 'green' }}>{done}</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <p>Quá hạn</p>
            <h1 style={{ color: 'red' }}>{overdue}</h1>
          </Card>
        </Col>
      </Row>
    </div>
  );
}