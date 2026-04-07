import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Rate,
  message,
} from 'antd';


const { Option } = Select;

interface Destination {
  id: number;
  name: string;
  type: 'biển' | 'núi' | 'thành phố';
  price: number;
  duration: number;
  foodCost: number;
  transportCost: number;
  hotelCost: number;
  rating: number;
  image: string;
}

const AdminDestination: React.FC = () => {
  const [data, setData] = useState<Destination[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('appData') || '{}');
    if (saved.destinations) setData(saved.destinations);
  }, []);


  const saveData = (newData: Destination[]) => {
    const saved = JSON.parse(localStorage.getItem('appData') || '{}');
    localStorage.setItem('appData', JSON.stringify({ ...saved, destinations: newData }));
    setData(newData);
  };

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

  const onEdit = (record: Destination) => {
    setEditing(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const onDelete = (id: number) => {
    saveData(data.filter((d) => d.id !== id));
    message.success('Xóa thành công');
  };

  const onFinish = (values: any) => {
    if (editing) {
      const newData = data.map((d) => (d.id === editing.id ? { ...editing, ...values } : d));
      saveData(newData);
      message.success('Cập nhật thành công');
    } else {
      const newDest: Destination = { id: Date.now(), ...values };
      saveData([...data, newDest]);
      message.success('Thêm mới thành công');
    }
    setVisible(false);
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Giá', dataIndex: 'price', render: (val: number) => val.toLocaleString() },
    { title: 'Thời gian (h)', dataIndex: 'duration' },
    { title: 'Đánh giá', dataIndex: 'rating', render: (val: number) => <Rate disabled value={val} /> },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (val: string) => <img src={val} alt="img" style={{ width: 80, height: 60, objectFit: 'cover' }} />,
    },
    {
      title: 'Hành động',
      render: (_: any, record: Destination) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={onAdd}>
        Thêm điểm đến
      </Button>

      <Table rowKey="id" dataSource={data} columns={columns} />

      <Modal
        title={editing ? 'Sửa điểm đến' : 'Thêm điểm đến'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
            <Select>
              <Option value="biển">Biển</Option>
              <Option value="núi">Núi</Option>
              <Option value="thành phố">Thành phố</Option>
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="duration" label="Thời gian tham quan (h)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="foodCost" label="Chi phí ăn uống" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="transportCost" label="Chi phí di chuyển" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="hotelCost" label="Chi phí lưu trú" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>

          <Form.Item name="image" label="Hình ảnh">
            <Input placeholder="URL hình ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDestination;