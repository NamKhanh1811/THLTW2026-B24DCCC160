import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import { useState, useEffect } from 'react';

export default function DichVu() {

  const [services, setServices] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem("services");
    if (data) {
      setServices(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const addService = (values:any) => {
    setServices([...services, { id: Date.now(), ...values }]);
    setVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: "Tên dịch vụ", dataIndex: "name" },
    { title: "Giá", dataIndex: "price" },
    { title: "Thời gian (phút)", dataIndex: "duration" }
  ];

  return (
    <div>

      <Button type="primary" onClick={() => setVisible(true)}>
        Thêm dịch vụ
      </Button>

      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
      />

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={addService} layout="vertical">

          <Form.Item name="name" label="Tên dịch vụ">
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Giá">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="duration" label="Thời gian">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

        </Form>
      </Modal>

    </div>
  );
}