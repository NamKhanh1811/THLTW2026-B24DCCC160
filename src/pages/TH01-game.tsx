import { useState } from "react";
import { Card, InputNumber, Button, Typography } from "antd";

export default function Game() {


const [numberRandom] = useState(Math.floor(Math.random() * 100) + 1);

const [userInput, setUserInput] = useState<number | null>(null);
const [count, setCount] = useState(10);
const [text, setText] = useState("");
const [isEnd, setIsEnd] = useState(false);

const checkNumber = () => {
if (isEnd) return;

if (userInput == null) {
  setText("Nhập số đi đã...");
  return;
}

if (userInput === numberRandom) {
  setText("Đúng rồi!");
  setIsEnd(true);
} else {
  if (userInput < numberRandom) {
    setText("Nhỏ quá");
  } else {
    setText("Lớn quá");
  }
}

let temp = count - 1;
setCount(temp);

if (temp <= 0 && userInput !== numberRandom) {
  setText("Hết lượt r, Số đúng là " + numberRandom);
  setIsEnd(true);
}

};

return (
<Card title="Game đoán số">
<p>Máy random 1 số từ 1 đến 100</p>
<p>Còn lại {count} lượt</p>

  <InputNumber
    min={1}
    max={100}
    value={userInput as any}
    onChange={(val) => setUserInput(val as number)}
    disabled={isEnd}
  />

  <Button
    type="primary"
    onClick={checkNumber}
    style={{ marginLeft: "10px" }}
    disabled={isEnd}
  >
    Đoán thử
  </Button>

  {text ? (
    <Typography.Title level={4} style={{ marginTop: 15 }}>
      {text}
    </Typography.Title>
  ) : null}
</Card>

);
}