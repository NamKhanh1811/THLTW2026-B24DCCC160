import {Table, Input, Select, Button, Modal, Form, DatePicker, Tag, Space } from 'antd';
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    '' | TaskStatus
  >('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [form] = Form.useForm();

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

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: Task) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      deadline: record.deadline ? dayjs(record.deadline) : null,
    });
    setOpen(true);
  };

  const onFinish = (values: any) => {
    const current = getTasks();

    if (editing) {
      const updated = current.map((t: Task) =>
        t.id === editing.id
          ? {
              ...t,
              ...values,
              deadline: values.deadline?.toISOString(),
            }
          : t
      );
      saveTasks(updated);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description,
        status: 'todo',
        priority: values.priority,
        tags: values.tags,
        deadline: values.deadline?.toISOString(),
      };

      saveTasks([...current, newTask]);
    }

    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter((t: Task) => t.id !== id);
    saveTasks(updated);
  };


  const filtered = tasks
    .filter((t: Task) =>
      t.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t: Task) =>
      statusFilter ? t.status === statusFilter : true
    );

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (d: string) =>
        d ? dayjs(d).format('DD/MM/YYYY') : '-',
      sorter: (a: Task, b: Task) =>
        new Date(a.deadline || 0).getTime() -
        new Date(b.deadline || 0).getTime(),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      render: (p: Priority) => {
        const color =
          p === 'high'
            ? 'red'
            : p === 'medium'
            ? 'orange'
            : 'green';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: TaskStatus) => {
        const map = {
          todo: 'Cần làm',
          inprogress: 'Đang làm',
          done: 'Hoàn thành',
        };
        return <Tag>{map[s]}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags?: string[]) =>
        tags?.map((t: string) => (
          <Tag key={t}>{t}</Tag>
        )),
    },
    {
      title: 'edit',
      render: (_: any, record: Task) => (
        <Space>
          <Button onClick={() => openEdit(record)}>sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Task List</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openAdd}>
          + Thêm Task
        </Button>

        <Input
          placeholder="Tìm kiếm..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          placeholder="lọc trạng thái"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Select.Option value="todo">Cần làm</Select.Option>
          <Select.Option value="inprogress">
            Đang làm
          </Select.Option>
          <Select.Option value="done">Hoàn thành</Select.Option>
        </Select>
      </Space>


      <Table
        rowKey="id"
        dataSource={filtered}
        columns={columns}
      />

      <Modal
        title={editing ? 'Edit Task' : 'Add Task'}
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên task"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="deadline" label="Deadline">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Ưu tiên"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="high">Cao</Select.Option>
              <Select.Option value="medium">
                Trung bình
              </Select.Option>
              <Select.Option value="low">Thấp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tag">
            <Select mode="tags" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}