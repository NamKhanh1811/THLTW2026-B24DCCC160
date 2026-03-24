import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import FormVanBang, { FormVanBangField } from './formvanbang';
import moment, { Moment } from 'moment';

interface QuyetDinh {
  id: number;
  soQD: string;
  ngay?: Moment;
  trichYeu?: string;
}

interface VanBang {
  id: number;
  soVaoSo?: string;
  soHieu?: string;
  msv?: string;
  hoTen?: string;
  quyetDinhId?: number;
  [key: string]: string | number | Moment | undefined;
}

const STORAGE_VANBANG = 'van_bang_list';
const STORAGE_QUYETDINH = 'quyet_dinh_list';

const VanBangPage: React.FC = () => {
  const [data, setData] = useState<VanBang[]>([]);
  const [quyetDinhList, setQuyetDinhList] = useState<QuyetDinh[]>([]);
  const [form] = Form.useForm(); // ✅ phải destructure đúng

  const formVanBangFields: FormVanBangField[] = [
    { name: 'diemTB', type: 'number' },
    { name: 'noiSinh', type: 'string' },
  ];

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const rawVB = localStorage.getItem(STORAGE_VANBANG);
    if (rawVB) setData(JSON.parse(rawVB));

    const rawQD = localStorage.getItem(STORAGE_QUYETDINH);
    if (rawQD) setQuyetDinhList(JSON.parse(rawQD));
  }, []);

  // Tự động set số vào sổ
  useEffect(() => {
    const nextSoVaoSo =
      data.length > 0
        ? (parseInt(data[data.length - 1].soVaoSo || '0') + 1).toString()
        : '1';
    form.setFieldsValue({ soVaoSo: nextSoVaoSo });
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const newItem: VanBang = {
        id: Date.now(),
        soVaoSo: values.soVaoSo,
        ...values,
      };

      const newData = [...data, newItem];
      setData(newData);
      localStorage.setItem(STORAGE_VANBANG, JSON.stringify(newData));

      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<VanBang> = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
    { title: 'Số hiệu', dataIndex: 'soHieu' },
    { title: 'MSV', dataIndex: 'msv' },
    { title: 'Họ tên', dataIndex: 'hoTen' },
    {
      title: 'Quyết định',
      dataIndex: 'quyetDinhId',
      render: (val: number) => {
        const qd = quyetDinhList.find((q) => q.id === val);
        return qd?.soQD || '';
      },
    },
    ...formVanBangFields.map((f) => ({
      title: f.name,
      dataIndex: f.name,
      render: (value: string | number | Moment | undefined) => {
        if (f.type === 'date' && value)
          return (value as Moment).format('DD/MM/YYYY');
        return value;
      },
    })),
  ];

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item label="Số vào sổ" name="soVaoSo">
          <Input disabled placeholder="Tự động tăng" />
        </Form.Item>

        <Form.Item
          name="soHieu"
          label="Số hiệu"
          rules={[{ required: true, message: 'Nhập số hiệu' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="msv" label="Mã SV">
          <Input />
        </Form.Item>

        <Form.Item name="hoTen" label="Họ tên">
          <Input />
        </Form.Item>

        <Form.Item
          name="quyetDinhId"
          label="Quyết định tốt nghiệp"
          rules={[{ required: true, message: 'Chọn quyết định' }]}
        >
          <Select>
            {quyetDinhList.map((qd) => (
              <Select.Option key={qd.id} value={qd.id}>
                {qd.soQD}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {formVanBangFields.map((f) => (
          <Form.Item key={f.name} name={f.name} label={f.name}>
            <FormVanBang field={f} />
          </Form.Item>
        ))}

        <Button type="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Form>

      <Table<VanBang>
        rowKey="id"
        dataSource={data}
        columns={columns}
        style={{ marginTop: 16 }}
      />
    </>
  );
};

export default VanBangPage;