import {
  Table, Button, Modal, Form, Input,
  Select, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { Order, OrderProduct, StoreModelType } from '@/models/store';

export default function Orders() {

  const { products, setProducts, orders, setOrders } =
    useModel('store') as StoreModelType;

  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const createOrder = (values: any) => {

    const selected: OrderProduct[] = values.items?.map((item: any) => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error('Product not found');

      return {
        productId: prod.id,
        productName: prod.name,
        quantity: item.quantity,
        price: prod.price,
      };
    }) || [];

    const total = selected.reduce(
      (sum: number, p: OrderProduct) => sum + p.quantity * p.price,
      0
    );

    const newOrder: Order = {
      id: 'DH' + Date.now(),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: selected,
      totalAmount: total,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn thành công');
    setOpen(false);
    form.resetFields();
  };

  const updateStatus = (order: Order, status: string) => {

    if (order.status === 'Hoàn thành') return;

    if (status === 'Hoàn thành') {
      const updated = products.map(p => {
        const item = order.products.find(i => i.productId === p.id);
        if (item) return { ...p, quantity: p.quantity - item.quantity };
        return p;
      });
      setProducts(updated);
    }

    if (status === 'Đã hủy') {
      const updated = products.map(p => {
        const item = order.products.find(i => i.productId === p.id);
        if (item) return { ...p, quantity: p.quantity + item.quantity };
        return p;
      });
      setProducts(updated);
    }

    setOrders(
      orders.map((o: Order) =>
        o.id === order.id ? { ...o, status } : o
      )
    );
  };

  const columns: ColumnsType<Order> = [
    { title: 'Mã', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    },
    {
      title: 'Trạng thái',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(v: string) => updateStatus(record, v)}
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Tạo đơn
      </Button>

      <Table<Order>
        columns={columns}
        dataSource={orders}
        rowKey="id"
      />

      <Modal
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={createOrder} layout="vertical">
          <Form.Item name="customerName" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="SĐT"
            rules={[
              { required: true },
              { pattern: /^[0-9]{10,11}$/ },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}