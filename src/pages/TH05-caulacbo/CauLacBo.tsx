import React, { useEffect, useState } from 'react';
import {Table, Button, Modal, Form, Input, DatePicker, Switch, message} from 'antd';
import moment from 'moment';

const STORAGE_KEY = 'TH05_CLUBS';

const getData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const setData = (data: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const CauLacBo = () => {
  const [data, setDataState] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setDataState(getData());
  }, []);

  const reload = () => {
    setDataState(getData());
  };

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      createdAt: moment(record.createdAt),
    });
    setVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const newItem = {
        ...values,
        id: editing ? editing.id : Date.now().toString(),
        createdAt: values.createdAt.format('YYYY-MM-DD'),
      };

      let newData = [];

      if (editing) {
        newData = data.map(item =>
          item.id === editing.id ? newItem : item
        );
      } else {
        newData = [...data, newItem];
      }

      setData(newData);
      setVisible(false);
      reload();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xoá?',
      onOk() {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        reload();
        message.success('Đã xoá');
      },
    });
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      render: (url: string) =>
        url ? <img src={url} width={50} /> : 'Không có',
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'createdAt',
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      render: (v: boolean) => (v ? '✅' : '❌'),
    },
    {
      title: 'Action',
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => openEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Câu lạc bộ</h2>

      <Button type="primary" onClick={openAdd}>
        Thêm CLB
      </Button>

      <Table rowKey="id" dataSource={data} columns={columns} />

      <Modal
        title={editing ? 'Sửa CLB' : 'Thêm CLB'}
        visible={visible}
        onOk={handleSave}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên CLB"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="avatar" label="Link ảnh">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Ngày thành lập"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="leader" label="Chủ nhiệm">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Hoạt động"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauLacBo;