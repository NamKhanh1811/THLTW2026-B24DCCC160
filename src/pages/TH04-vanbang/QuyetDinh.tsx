import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Moment } from 'moment';
import moment from 'moment';

interface QuyetDinh {
  id: number;
  soQD: string;
  ngay?: Moment;
  trichYeu?: string;
  soVanBangId?: number;
  luotTraCuu: number;
}

interface QuyetDinhStorage {
  id: number;
  soQD: string;
  ngay?: string;
  trichYeu?: string;
  soVanBangId?: number;
  luotTraCuu: number;
}

interface SoVanBang {
  id: number;
  ten: string;
}

const STORAGE_KEY = 'quyet_dinh_list';

const QuyetDinhPage: React.FC = () => {
  const [data, setData] = useState<QuyetDinh[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const soVanBangList: SoVanBang[] = [
    { id: 1, ten: 'Sổ 2025' },
  ];

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: QuyetDinhStorage[] = JSON.parse(raw);
      const converted: QuyetDinh[] = parsed.map((item) => ({
        ...item,
        ngay: item.ngay ? moment(item.ngay) : undefined,
      }));
      setData(converted);
    }
  }, []);

  const saveToStorage = (list: QuyetDinh[]) => {
    const toSave: QuyetDinhStorage[] = list.map((item) => ({
      ...item,
      ngay: item.ngay ? item.ngay.toISOString() : undefined,
      luotTraCuu: item.luotTraCuu,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      if (!soVanBangList.find((s) => s.id === values.soVanBangId)) {
        message.error('Sổ văn bằng không hợp lệ');
        return;
      }

      const newItem: QuyetDinh = {
        id: Date.now(),
        soQD: values.soQD,
        ngay: values.ngay,
        trichYeu: values.trichYeu,
        soVanBangId: values.soVanBangId,
        luotTraCuu: 0,
      };

      const newData = [...data, newItem];
      setData(newData);
      saveToStorage(newData);

      setVisible(false);
      form.resetFields();
      message.success('Thêm quyết định thành công');
    } catch (error) {}
  };

  const columns: ColumnsType<QuyetDinh> = [
    { title: 'Số QĐ', dataIndex: 'soQD' },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngay',
      render: (value: Moment | undefined) =>
        value ? value.format('DD/MM/YYYY') : '',
    },
    { title: 'Trích yếu', dataIndex: 'trichYeu' },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'soVanBangId',
      render: (id: number) =>
        soVanBangList.find((s) => s.id === id)?.ten || '',
    },
    { title: 'Lượt tra cứu', dataIndex: 'luotTraCuu' },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} style={{ marginBottom: 16 }}>
        Thêm quyết định
      </Button>

      <Table<QuyetDinh>
        rowKey="id"
        columns={columns}
        dataSource={data}
      />

      <Modal
        title="Thêm quyết định"
        visible={visible}
        onOk={handleAdd}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="soQD"
            label="Số QĐ"
            rules={[{ required: true, message: 'Nhập số quyết định' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="ngay" label="Ngày ban hành">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="trichYeu" label="Trích yếu">
            <Input />
          </Form.Item>

          <Form.Item
            name="soVanBangId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}
          >
            <Select>
              {soVanBangList.map((i) => (
                <Select.Option key={i.id} value={i.id}>
                  {i.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuyetDinhPage;