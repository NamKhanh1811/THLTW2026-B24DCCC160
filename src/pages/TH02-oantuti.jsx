import React, { useState } from "react";
import { Button, Card, List } from "antd";

const list = ["Kéo", "Búa", "Bao"];

export default function OanTuTi() {

const [may, setMay] = useState("");
const [ketQua, setKetQua] = useState("");
const [lichSu, setLichSu] = useState([]);

const playGame = (chon) => {

const rd = Math.floor(Math.random() * list.length);
const mayRandom = list[rd];

setMay(mayRandom);

let kq = "";

if (chon === mayRandom) {
  kq = "Hòa";
} else {
  if (
    (chon === "Kéo" && mayRandom === "Bao") ||
    (chon === "Búa" && mayRandom === "Kéo") ||
    (chon === "Bao" && mayRandom === "Búa")
  ) {
    kq = "thắng";
  } else {
    kq = "thua";
  }
}

setKetQua(kq);

const item = {
  player: chon,
  computer: mayRandom,
  result: kq
};

const newList = [item, ...lichSu];

setLichSu(newList);

};

return (
<Card title="Trò chơi Oẳn Tù Tì">

  <h3>Chọn lựa của bạn:</h3>

  <Button onClick={() => playGame("Kéo")} style={{ marginRight: 10 }}>
    Kéo ✌️
  </Button>

  <Button onClick={() => playGame("Búa")} style={{ marginRight: 10 }}>
    Búa ✊
  </Button>

  <Button onClick={() => playGame("Bao")}>
    Bao 🖐
  </Button>

  <hr />

  <h3>Máy chọn: {may}</h3>

  <h2>Kết quả: {ketQua}</h2>

  <hr />

  <h3>Lịch sử trận đấu</h3>

  <List
    bordered
    dataSource={lichSu}
    renderItem={(item, index) => {
      const soVan = lichSu.length - index;

      return (
        <List.Item>
          Ván {soVan} : Bạn {item.player} - Máy {item.computer} → {item.result}
        </List.Item>
      );
    }}
  />

</Card>

);
}