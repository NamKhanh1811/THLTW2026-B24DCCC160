import React, { useState } from "react";
import { Button, InputNumber, Card, message, List, Select } from "antd";

export default function DeThi() {

  const [monHoc, setMonHoc] = useState("");
  const [khoi, setKhoi] = useState("");

  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const [veryHard, setVeryHard] = useState(0);

  const [deThi, setDeThi] = useState([]);

  const bank = JSON.parse(localStorage.getItem("cauhoi")) || [];

  const randomCauHoi = (arr, soLuong) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, soLuong);
  };

  const taoDe = () => {

    if (!monHoc || !khoi) {
      message.error("Vui lòng chọn môn học và khối kiến thức");
      return;
    }

    const bankFilter = bank.filter(
      c => c.mon === monHoc && c.khoi === khoi
    );

    const easyList = bankFilter.filter(c => c.mucDo === "Dễ");
    const mediumList = bankFilter.filter(c => c.mucDo === "Trung bình");
    const hardList = bankFilter.filter(c => c.mucDo === "Khó");
    const veryHardList = bankFilter.filter(c => c.mucDo === "Rất khó");

    if (
      easyList.length < easy ||
      mediumList.length < medium ||
      hardList.length < hard ||
      veryHardList.length < veryHard
    ) {
      message.error("Không đủ câu hỏi phù hợp trong ngân hàng");
      return;
    }

    const de = [
      ...randomCauHoi(easyList, easy),
      ...randomCauHoi(mediumList, medium),
      ...randomCauHoi(hardList, hard),
      ...randomCauHoi(veryHardList, veryHard),
    ];

    setDeThi(de);

    const oldDe = JSON.parse(localStorage.getItem("dethi")) || [];
    localStorage.setItem("dethi", JSON.stringify([...oldDe, de]));

    const cauTruc = {
      monHoc,
      khoi,
      easy,
      medium,
      hard,
      veryHard
    };

    const oldCauTruc = JSON.parse(localStorage.getItem("cautrucdethi")) || [];
    localStorage.setItem("cautrucdethi", JSON.stringify([...oldCauTruc, cauTruc]));

    message.success("Tạo đề thi thành công!");
  };

  const monList = JSON.parse(localStorage.getItem("monhoc")) || [];
  const khoiList = JSON.parse(localStorage.getItem("khoikienthuc")) || [];

  return (
    <Card title="Tạo đề thi">

      <p>Môn học</p>
      <Select
        style={{ width: "100%" }}
        placeholder="Chọn môn học"
        onChange={setMonHoc}
      >
        {monList.map((m) => (
          <Select.Option key={m.id} value={m.ten}>
            {m.ten}
          </Select.Option>
        ))}
      </Select>

      <p style={{ marginTop: 10 }}>Khối kiến thức</p>
      <Select
        style={{ width: "100%" }}
        placeholder="Chọn khối"
        onChange={setKhoi}
      >
        {khoiList.map((k) => (
          <Select.Option key={k.id} value={k.ten}>
            {k.ten}
          </Select.Option>
        ))}
      </Select>

      <p style={{ marginTop: 10 }}>Câu dễ</p>
      <InputNumber min={0} onChange={setEasy} />

      <p>Câu trung bình</p>
      <InputNumber min={0} onChange={setMedium} />

      <p>Câu khó</p>
      <InputNumber min={0} onChange={setHard} />

      <p>Câu rất khó</p>
      <InputNumber min={0} onChange={setVeryHard} />

      <br /><br />

      <Button type="primary" onClick={taoDe}>
        Tạo đề
      </Button>

      <br /><br />

      {deThi.length > 0 && (
        <>
          <h3>Đề thi đã tạo</h3>

          <List
            bordered
            dataSource={deThi}
            renderItem={(item, index) => (
              <List.Item>
                Câu {index + 1}: {item.noiDung} ({item.mucDo})
              </List.Item>
            )}
          />
        </>
      )}

    </Card>
  );
}