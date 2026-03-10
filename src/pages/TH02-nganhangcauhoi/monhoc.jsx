import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input } from "antd";

export default function MonHoc() {

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [ma, setMa] = useState("");
  const [ten, setTen] = useState("");
  const [tinchi, setTinChi] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("monhoc");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("monhoc", JSON.stringify(data));
  }, [data]);

  const addMon = () => {
    const item = {
      id: Date.now(),
      ma,
      ten,
      tinchi,
    };

    setData([...data, item]);

    setMa("");
    setTen("");
    setTinChi("");

    setOpen(false);
  };

  const columns = [
    { title: "Mã môn", dataIndex: "ma" },
    { title: "Tên môn", dataIndex: "ten" },
    { title: "Số tín chỉ", dataIndex: "tinchi" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm môn
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        visible={open}
        onOk={addMon}
        onCancel={() => setOpen(false)}
        title="Thêm môn học"
      >
        <Input
          placeholder="Mã môn"
          value={ma}
          onChange={(e) => setMa(e.target.value)}
        />

        <Input
          placeholder="Tên môn"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
        />

        <Input
          placeholder="Số tín chỉ"
          value={tinchi}
          onChange={(e) => setTinChi(e.target.value)}
        />
      </Modal>
    </>
  );
}