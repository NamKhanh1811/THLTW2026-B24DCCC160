import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface SoVanBang {
  id: number;
  nam: string;
  tenSo: string;
  soHienTai: number;
}

const STORAGE_KEY = 'so_van_bang_list';

const SoVanBangPage: React.FC = () => {
  const [data, setData] = useState<SoVanBang[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setData(JSON.parse(raw));
  }, []);

  const saveToStorage = (list: SoVanBang[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const existingOfYear = data.filter(item => item.nam === values.nam);
      const nextSoHienTai = existingOfYear.length > 0
        ? Math.max(...existingOfYear.map(i => i.soHienTai)) + 1
        : 1;

      const newItem: SoVanBang = {
        id: Date.now(),
        nam: values.nam,
        tenSo: values.tenSo,
        soHienTai: nextSoHienTai,
      };

      const newData = [...data, newItem];
      setData(newData);
      saveToStorage(newData);

      setVisible(false);
      form.resetFields();
    } catch (err) {}
  };

  const columns: ColumnsType<SoVanBang> = [
    { title: 'Năm', dataIndex: 'nam' },
    { title: 'Tên sổ', dataIndex: 'tenSo' },
    { title: 'Số hiện tại', dataIndex: 'soHienTai' },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm sổ
      </Button>

      <Table<SoVanBang>
        rowKey="id"
        columns={columns}
        dataSource={data}
      />

      <Modal
        title="Thêm sổ văn bằng"
        visible={visible}
        onOk={handleAdd}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nam"
            label="Năm"
            rules={[{ required: true, message: 'Nhập năm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenSo"
            label="Tên sổ"
            rules={[{ required: true, message: 'Nhập tên sổ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SoVanBangPage;