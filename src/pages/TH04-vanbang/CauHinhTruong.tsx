import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface FieldConfig {
  id: number;
  name: string;
  type: 'string' | 'number' | 'date';
}

const STORAGE_KEY = 'field_config_list';

const CauHinhTruong: React.FC = () => {
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setFields(JSON.parse(raw));
  }, []);

  const saveToStorage = (list: FieldConfig[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleAddOrEdit = async () => {
    try {
      const values = await form.validateFields();

      const duplicate = fields.some(
        (f) => f.name === values.name && f.id !== editingField?.id
      );
      if (duplicate) {
        message.error('Tên trường đã tồn tại!');
        return;
      }

      if (editingField) {
        const updatedFields = fields.map((f) =>
          f.id === editingField.id ? { ...f, name: values.name, type: values.type } : f
        );
        setFields(updatedFields);
        saveToStorage(updatedFields);
        message.success('Cập nhật thành công!');
      } else {

        const newField: FieldConfig = {
          id: Date.now(),
          name: values.name,
          type: values.type,
        };
        const newFields = [...fields, newField];
        setFields(newFields);
        saveToStorage(newFields);
        message.success('Thêm trường thành công!');
      }

      setVisible(false);
      setEditingField(null);
      form.resetFields();
    } catch (err) {}
  };

  const handleEdit = (field: FieldConfig) => {
    setEditingField(field);
    setVisible(true);
    form.setFieldsValue({ name: field.name, type: field.type });
  };

  const handleDelete = (id: number) => {
    const newFields = fields.filter((f) => f.id !== id);
    setFields(newFields);
    saveToStorage(newFields);
    message.success('Xóa trường thành công!');
  };

  const columns: ColumnsType<FieldConfig> = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Kiểu', dataIndex: 'type' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} style={{ marginBottom: 16 }}>
        Thêm trường
      </Button>

      <Table<FieldConfig> rowKey="id" dataSource={fields} columns={columns} />

      <Modal
        title={editingField ? 'Sửa trường' : 'Thêm trường'}
        visible={visible}
        onOk={handleAddOrEdit}
        onCancel={() => {
          setVisible(false);
          setEditingField(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: 'Nhập tên trường' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Chọn kiểu dữ liệu' }]}
          >
            <Select>
              <Select.Option value="string">String</Select.Option>
              <Select.Option value="number">Number</Select.Option>
              <Select.Option value="date">Date</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CauHinhTruong;