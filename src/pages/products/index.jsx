import React, { useState } from 'react';
import {
  Table,
  Button,
  Form,
  Modal,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Space,
} from 'antd';

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddProduct = () => {
    form.validateFields().then((values) => {
      const newProduct = {
        id: Date.now(),
        ...values,
      };
      setProducts([...products, newProduct]);
      message.success('Thêm sản phẩm thành công');
      form.resetFields();
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      render: (price) => price.toLocaleString(),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sản phẩm</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredProducts}
      />

      <Modal
        title="Thêm sản phẩm"
        visible={isModalOpen}
        onOk={handleAddProduct}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Nhập giá' },
              {
                validator: (_, value) => {
                    if(!value) return Promise.resolve();
                    if (Number.isInteger(value) && value > 0) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Giá phải là số nguyên dương'));
                }
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Nhập số lượng' },
              {
                validator: (_, value) => {
                    if(!value) return Promise.resolve();
                    if (Number.isInteger(value) && value > 0) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Số lượng phải là số nguyên dương'));
                }
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const initialProducts = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default ProductManagement;
