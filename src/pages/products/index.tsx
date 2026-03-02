import {
  Table, Tag, Input, Select, Slider,
  Space
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import { useState, useMemo } from 'react';
import type { Product, StoreModelType } from '@/models/store';

export default function Products() {

  const { products } = useModel('store', (model: StoreModelType) => model);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);

  const getStatus = (q: number): string => {
    if (q > 10) return 'Còn hàng';
    if (q > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  const filtered = useMemo<Product[]>(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!category || p.category === category) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      (!status || getStatus(p.quantity) === status)
    );
  }, [products, search, category, priceRange, status]);

  const columns: ColumnsType<Product> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    { title: 'Danh mục', dataIndex: 'category' },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Trạng thái',
      render: (_, record) => {
        const s = getStatus(record.quantity);
        return (
          <Tag color={
            s === 'Còn hàng'
              ? 'green'
              : s === 'Sắp hết'
              ? 'orange'
              : 'red'
          }>
            {s}
          </Tag>
        );
      }
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm"
          onChange={e => setSearch(e.target.value)}
        />

        <Select
          allowClear
          placeholder="Danh mục"
          onChange={setCategory}
          style={{ width: 150 }}
        >
          <Select.Option value="Laptop">Laptop</Select.Option>
          <Select.Option value="Điện thoại">Điện thoại</Select.Option>
          <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
          <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
        </Select>

        <Select
          allowClear
          placeholder="Trạng thái"
          onChange={setStatus}
          style={{ width: 150 }}
        >
          <Select.Option value="Còn hàng">Còn hàng</Select.Option>
          <Select.Option value="Sắp hết">Sắp hết</Select.Option>
          <Select.Option value="Hết hàng">Hết hàng</Select.Option>
        </Select>
      </Space>

      <Slider
        range
        max={50000000}
        value={priceRange}
        onChange={(value) => setPriceRange(value as [number, number])}
        style={{ width: 400, marginBottom: 16 }}
      />

      <Table<Product>
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}