import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';

interface SearchForm {
  soHieu?: string;
  soVaoSo?: string;
  msv?: string;
  hoTen?: string;
}

interface VanBang {
  id: number;
  soVaoSo?: string;
  soHieu?: string;
  msv?: string;
  hoTen?: string;
  quyetDinhId?: number;
  [key: string]: any;
}

interface QuyetDinh {
  id: number;
  soQD: string;
  ngay?: string;
  trichYeu?: string;
}

const STORAGE_VANBANG = 'van_bang_list';
const STORAGE_QUYETDINH = 'quyet_dinh_list';
const STORAGE_VIEWCOUNT = 'quyet_dinh_views';

const TraCuuPage: React.FC = () => {
  const [form] = Form.useForm<SearchForm>();
  const [vanBangList, setVanBangList] = useState<VanBang[]>([]);
  const [quyetDinhList, setQuyetDinhList] = useState<QuyetDinh[]>([]);
  const [result, setResult] = useState<VanBang[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const rawVB = localStorage.getItem(STORAGE_VANBANG);
    if (rawVB) setVanBangList(JSON.parse(rawVB));

    const rawQD = localStorage.getItem(STORAGE_QUYETDINH);
    if (rawQD) setQuyetDinhList(JSON.parse(rawQD));

    const rawViews = localStorage.getItem(STORAGE_VIEWCOUNT);
    if (rawViews) setViewCounts(JSON.parse(rawViews));
  }, []);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const filled = Object.values(values).filter((v) => v !== undefined && v !== '').length;

    if (filled < 2) {
      message.error('Nhập ít nhất 2 trường');
      return;
    }

    const filtered = vanBangList.filter((vb) => {
      return (
        (!values.soHieu || vb.soHieu?.includes(values.soHieu)) &&
        (!values.soVaoSo || vb.soVaoSo?.includes(values.soVaoSo)) &&
        (!values.msv || vb.msv?.includes(values.msv)) &&
        (!values.hoTen || vb.hoTen?.toLowerCase().includes(values.hoTen.toLowerCase()))
      );
    });

    const newViewCounts = { ...viewCounts };
    filtered.forEach((vb) => {
      if (vb.quyetDinhId) {
        newViewCounts[vb.quyetDinhId] = (newViewCounts[vb.quyetDinhId] || 0) + 1;
      }
    });
    setViewCounts(newViewCounts);
    localStorage.setItem(STORAGE_VIEWCOUNT, JSON.stringify(newViewCounts));

    setResult(filtered);
  };

  const columns: ColumnsType<VanBang> = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
    { title: 'Số hiệu', dataIndex: 'soHieu' },
    { title: 'MSV', dataIndex: 'msv' },
    { title: 'Họ tên', dataIndex: 'hoTen' },
    {
      title: 'Số QĐ',
      dataIndex: 'quyetDinhId',
      render: (val: number) => {
        const qd = quyetDinhList.find((q) => q.id === val);
        return qd?.soQD || '';
      },
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'quyetDinhId',
      render: (val: number) => {
        const qd = quyetDinhList.find((q) => q.id === val);
        return qd?.ngay ? moment(qd.ngay).format('DD/MM/YYYY') : '';
      },
    },
    {
      title: 'Trích yếu',
      dataIndex: 'quyetDinhId',
      render: (val: number) => {
        const qd = quyetDinhList.find((q) => q.id === val);
        return qd?.trichYeu || '';
      },
    },
  ];

  return (
    <>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="soHieu">
          <Input placeholder="Số hiệu" />
        </Form.Item>
        <Form.Item name="soVaoSo">
          <Input placeholder="Số vào sổ" />
        </Form.Item>
        <Form.Item name="msv">
          <Input placeholder="MSV" />
        </Form.Item>
        <Form.Item name="hoTen">
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Button type="primary" onClick={handleSearch}>
          Tra cứu
        </Button>
      </Form>

      <Table<VanBang>
        rowKey="id"
        dataSource={result}
        columns={columns}
      />
    </>
  );
};

export default TraCuuPage;