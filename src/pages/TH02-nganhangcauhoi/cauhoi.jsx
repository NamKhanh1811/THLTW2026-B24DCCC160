import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select } from "antd";

export default function CauHoi() {

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [noiDung, setNoiDung] = useState("");
  const [mon, setMon] = useState("");
  const [mucDo, setMucDo] = useState("");
  const [khoi, setKhoi] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cauhoi");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cauhoi", JSON.stringify(data));
  }, [data]);

  const add = () => {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const item = {
      id: newId,
      mon,
      noiDung,
      mucDo,
      khoi
    };

    setData([...data, item]);

    setMon("");
    setKhoi("");
    setMucDo("");
    setNoiDung("");

    setOpen(false);
  };

  const columns = [
    { title: "Môn học", dataIndex: "mon" },
    { title: "Khối kiến thức", dataIndex: "khoi" },
    { title: "Mức độ", dataIndex: "mucDo" },
    { title: "Nội dung", dataIndex: "noiDung" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm câu hỏi
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        visible={open}
        onOk={add}
        onCancel={() => setOpen(false)}
        title="Thêm câu hỏi"
      >

        <Input
          placeholder="Môn học"
          value={mon}
          onChange={(e) => setMon(e.target.value)}
        />

        <Input
          placeholder="Khối kiến thức"
          value={khoi}
          onChange={(e) => setKhoi(e.target.value)}
        />

        <Select
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Mức độ"
          value={mucDo}
          onChange={(v) => setMucDo(v)}
        >
          <Select.Option value="Dễ">Dễ</Select.Option>
          <Select.Option value="Trung bình">Trung bình</Select.Option>
          <Select.Option value="Khó">Khó</Select.Option>
          <Select.Option value="Rất khó">Rất khó</Select.Option>
        </Select>

        <Input.TextArea
          rows={4}
          placeholder="Nội dung câu hỏi"
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
        />

      </Modal>
    </>
  );
}