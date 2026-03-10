import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal } from "antd";

export default function KhoiKienThuc() {

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("khoikienthuc");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("khoikienthuc", JSON.stringify(data));
  }, [data]);

  const addItem = () => {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newItem = {
      id: newId,
      ten: name,
    };

    setData([...data, newItem]);
    setName("");
    setOpen(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên khối kiến thức", dataIndex: "ten" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm khối
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        visible={open}
        onOk={addItem}
        onCancel={() => setOpen(false)}
        title="Thêm khối kiến thức"
      >
        <Input
          placeholder="Tên khối"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </>
  );
}