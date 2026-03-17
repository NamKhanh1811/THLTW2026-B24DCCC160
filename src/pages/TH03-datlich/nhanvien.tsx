import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space } from 'antd';

export default () => {

  const [employees, setEmployees] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem("employees");
    if (data) {
      setEmployees(JSON.parse(data));
    }
  }, []);

  const saveEmployees = (data:any[]) => {
    setEmployees(data);
    localStorage.setItem("employees", JSON.stringify(data));
  };

  const submitEmployee = (values: any) => {

    if(editingEmployee){
      const newEmployees = employees.map((e)=>
        e.id === editingEmployee.id ? { ...e, ...values } : e
      );

      saveEmployees(newEmployees);
    }else{
      const newEmployees = [
        ...employees,
        { id: Date.now(), ...values }
      ];

      saveEmployees(newEmployees);
    }

    setVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const openAdd = ()=>{
    setEditingEmployee(null);
    form.resetFields();
    setVisible(true);
  };

  const openEdit = (record:any)=>{
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const deleteEmployee = (id:number)=>{
    const newEmployees = employees.filter((e)=>e.id !== id);
    saveEmployees(newEmployees);
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Giới hạn khách/ngày", dataIndex: "maxPerDay" },
    { title: "Lịch làm việc", dataIndex: "workTime" },

    {
      title:"Thao tác",
      render:(_:any,record:any)=>(
        <Space>
          <Button type="link" onClick={()=>openEdit(record)}>
            Sửa
          </Button>

          <Button danger type="link" onClick={()=>deleteEmployee(record.id)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>

      <Button type="primary" onClick={openAdd}>
        Thêm nhân viên
      </Button>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        title={editingEmployee ? "Sửa nhân viên" : "Thêm nhân viên"}
      >

        <Form form={form} onFinish={submitEmployee} layout="vertical">

          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Nhập tên nhân viên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maxPerDay"
            label="Khách tối đa/ngày"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="workTime"
            label="Lịch làm việc"
            rules={[{ required: true }]}
          >
            <Input placeholder="9h-17h Thứ 6" />
          </Form.Item>

        </Form>

      </Modal>

    </div>
  );
};