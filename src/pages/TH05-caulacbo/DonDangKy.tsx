import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';

const { Option } = Select;

const STORAGE_KEY = 'TH05_APPLICATIONS';
const CLUB_KEY = 'TH05_CLUBS';

const getData = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const setData = (data: any[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const getClubs = () => JSON.parse(localStorage.getItem(CLUB_KEY) || '[]');

const DonDangKy = () => {
  const [data, setDataState] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    setClubs(getClubs());
  }, []);

  const loadData = () => {
    setDataState(getData());
  };

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      let newData = [];

      if (editing) {
        newData = data.map(item =>
          item.id === editing.id ? { ...editing, ...values } : item
        );
      } else {
        newData = [
          ...data,
          {
            ...values,
            id: Date.now().toString(),
            status: 'PENDING',
          },
        ];
      }

      setData(newData);
      setVisible(false);
      loadData();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xoá?',
      onOk() {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        loadData();
        message.success('Đã xoá nha');
      },
    });
  };

  const handleApprove = () => {
    const newData = data.map(item =>
      selectedRowKeys.includes(item.id) ? { ...item, status: 'APPROVED' } : item
    );
    setData(newData);
    setSelectedRowKeys([]);
    loadData();
    message.success('Đã duyệt nhé');
  };

  const handleReject = () => {
    let reason = '';
    Modal.confirm({
      title: 'Nhập lý do từ chối đê',
      content: <Input.TextArea onChange={(e) => (reason = e.target.value)} />,
      onOk() {
        if (!reason) {
          message.error('Phải nhập lý do đó');
          return Promise.reject();
        }
        const newData = data.map(item =>
          selectedRowKeys.includes(item.id)
            ? { ...item, status: 'REJECTED', note: reason }
            : item
        );
        setData(newData);
        setSelectedRowKeys([]);
        loadData();
        message.success('Đã từ chối');
      },
    });
  };

  const renderStatus = (status: string) => {
    if (status === 'APPROVED') return <Tag color="green">Approved</Tag>;
    if (status === 'REJECTED') return <Tag color="red">Rejected</Tag>;
    return <Tag color="orange">Pending</Tag>;
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'CLB', dataIndex: 'club' },
    { title: 'Trạng thái', dataIndex: 'status', render: renderStatus },
    { title: 'Ghi chú', dataIndex: 'note' },
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
      <h2>Quản lý đơn đăng ký</h2>

      <Button type="primary" onClick={openAdd}>
        Thêm đơn
      </Button>
      <Button
        onClick={handleApprove}
        disabled={!selectedRowKeys.length}
        style={{ marginLeft: 8 }}
      >
        Duyệt ({selectedRowKeys.length})
      </Button>
      <Button
        danger
        onClick={handleReject}
        disabled={!selectedRowKeys.length}
        style={{ marginLeft: 8 }}
      >
        Từ chối ({selectedRowKeys.length})
      </Button>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />

      <Modal
        title={editing ? 'Sửa đơn' : 'Thêm đơn'}
        visible={visible}
        onOk={handleSave}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="skill" label="Sở trường">
            <Input />
          </Form.Item>

          <Form.Item
            name="club"
            label="CLB"
            rules={[{ required: true, message: 'chọn CLB ii' }]}
          >
            <Select placeholder="Chọn CLB">
              {clubs.map((c) => (
                <Option key={c.id} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="reason" label="Lý do đăng ký">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DonDangKy;