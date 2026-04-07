import React, { useEffect, useState } from 'react';
import { Select, Button, Card, Tag, Row, Col } from 'antd';

const { Option } = Select;

interface Destination {
  id: number;
  name: string;
  price: number;
  travelTime: number;
}

interface Plan {
  [key: string]: Destination[];
}

interface AppData {
  filter?: any;
  plan?: Plan;
  destinations?: Destination[];
}

const LichTrinh: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [day, setDay] = useState<string>('day1');
  const [plan, setPlan] = useState<Plan>({ day1: [], day2: [], day3: [] });
  const [destinations, setDestinations] = useState<Destination[]>([]);

  //localStorage chung
  useEffect(() => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');

    //plan
    if (saved.plan) setPlan(saved.plan);

    if (saved.destinations && saved.destinations.length > 0) {
      setDestinations(saved.destinations);
    } else {
      const defaultDest: Destination[] = [
        { id: 1, name: 'Đà Nẵng', price: 3000000, travelTime: 2 },
        { id: 2, name: 'Sapa', price: 2500000, travelTime: 5 },
        { id: 3, name: 'Hà Nội', price: 2000000, travelTime: 1 },
      ];
      setDestinations(defaultDest);
      localStorage.setItem('appData', JSON.stringify({ ...saved, destinations: defaultDest }));
    }

    if (!saved.plan) {
      localStorage.setItem('appData', JSON.stringify({ ...saved, plan: { day1: [], day2: [], day3: [] } }));
    }
  }, []);

  useEffect(() => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');
    localStorage.setItem('appData', JSON.stringify({ ...saved, plan }));
  }, [plan]);

  const add = () => {
    if (!selected) return;
    const place = destinations.find((d) => d.id === selected);
    if (!place) return;

    const all = Object.values(plan).flat();
    if (all.some((p) => p.id === selected)) {
      alert(`${place.name} đã có trong lịch trình!`);
      return;
    }

    setPlan({ ...plan, [day]: [...plan[day], place] });
  };

  const remove = (dayKey: string, index: number) => {
    const newList = [...plan[dayKey]];
    newList.splice(index, 1);
    setPlan({ ...plan, [dayKey]: newList });
  };

  const moveUp = (dayKey: string, index: number) => {
    if (index === 0) return;
    const newList = [...plan[dayKey]];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setPlan({ ...plan, [dayKey]: newList });
  };

  const moveDown = (dayKey: string, index: number) => {
    const newList = [...plan[dayKey]];
    if (index === newList.length - 1) return;
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setPlan({ ...plan, [dayKey]: newList });
  };

  const all = Object.values(plan).flat();
  const totalCost = all.reduce((sum, i) => sum + i.price, 0);
  const totalTime = all.reduce((sum, i) => sum + i.travelTime, 0);

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Select
          placeholder="Chọn địa điểm"
          style={{ width: 200, marginRight: 10 }}
          onChange={(val) => setSelected(val)}
        >
          {destinations.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>

        <Select
          value={day}
          style={{ width: 120, marginRight: 10 }}
          onChange={(val) => setDay(val)}
        >
          <Option value="day1">Day 1</Option>
          <Option value="day2">Day 2</Option>
          <Option value="day3">Day 3</Option>
        </Select>

        <Button type="primary" onClick={add}>
          Thêm
        </Button>
      </Card>

      <Row gutter={[16, 16]}>
        {Object.keys(plan).map((dayKey) => (
          <Col xs={24} md={8} key={dayKey}>
            <Card title={dayKey.toUpperCase()}>
              {plan[dayKey].map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #ddd',
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 6,
                  }}
                >
                  <b>{item.name}</b>
                  <br />
                  <Tag color="blue">{item.price.toLocaleString()} VND</Tag>
                  <Tag color="green">{item.travelTime}h</Tag>

                  <div style={{ marginTop: 5 }}>
                    <Button size="small" onClick={() => moveUp(dayKey, index)}>
                      ↑
                    </Button>
                    <Button
                      size="small"
                      onClick={() => moveDown(dayKey, index)}
                      style={{ marginLeft: 5 }}
                    >
                      ↓
                    </Button>
                    <Button
                      danger
                      size="small"
                      style={{ marginLeft: 5 }}
                      onClick={() => remove(dayKey, index)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 20 }}>
        <h3>📊 Tổng kết</h3>
        <p>💰 Tổng chi phí: {totalCost.toLocaleString()} VND</p>
        <p>⏱️ Tổng thời gian: {totalTime} giờ</p>
      </Card>
    </div>
  );
};

export default LichTrinh;