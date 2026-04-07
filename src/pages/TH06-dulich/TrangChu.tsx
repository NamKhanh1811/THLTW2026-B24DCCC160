import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Slider, Rate, Button } from 'antd';

const { Option } = Select;

interface Destination {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  image: string;
}

interface Plan {
  [day: string]: Destination[];
}

interface AppData {
  filter?: {
    type: string;
    price: [number, number];
    rating: number;
  };
  plan?: Plan;
  destinations?: Destination[];
}

const TrangChu: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [price, setPrice] = useState<[number, number]>([0, 5000000]);
  const [rating, setRating] = useState<number>(0);
  const [day, setDay] = useState<string>('day1');
  const [destinations, setDestinations] = useState<Destination[]>([]);

  //localStorage chung
  useEffect(() => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');

    if (saved.filter) {
      setType(saved.filter.type || '');
      setPrice(saved.filter.price || [0, 5000000]);
      setRating(saved.filter.rating || 0);
    }

    if (saved.destinations && saved.destinations.length > 0) {
      setDestinations(saved.destinations);
    } else {
      const defaultDest: Destination[] = [
        { id: 1, name: 'Đà Nẵng', type: 'biển', price: 3000000, rating: 4.5, image: 'https://picsum.photos/300/200?1' },
        { id: 2, name: 'Sapa', type: 'núi', price: 2500000, rating: 4.2, image: 'https://picsum.photos/300/200?2' },
        { id: 3, name: 'Hà Nội', type: 'thành phố', price: 2000000, rating: 4.0, image: 'https://picsum.photos/300/200?3' },
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
    localStorage.setItem(
      'appData',
      JSON.stringify({
        ...saved,
        filter: { type, price, rating },
      }),
    );
  }, [type, price, rating]);

  const filtered = destinations.filter((item) => {
    return (
      (!type || item.type === type) &&
      item.price >= price[0] &&
      item.price <= price[1] &&
      item.rating >= rating
    );
  });

  const addToPlan = (dest: Destination) => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');
    const plan = saved.plan || { day1: [], day2: [], day3: [] };

    const all = Object.values(plan).flat();
    if (all.some((p) => p.id === dest.id)) {
      alert(`${dest.name} đã có trong lịch trình!`);
      return;
    }

    plan[day] = [...(plan[day] || []), dest];
    localStorage.setItem('appData', JSON.stringify({ ...saved, plan }));
    alert(`${dest.name} đã thêm vào ${day.toUpperCase()}`);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} md={6}>
          <Select
            value={type || undefined}
            placeholder="Loại hình"
            onChange={(val) => setType(val)}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="biển">Biển</Option>
            <Option value="núi">Núi</Option>
            <Option value="thành phố">Thành phố</Option>
          </Select>
        </Col>

        <Col xs={24} md={10}>
          <Slider
            range
            min={0}
            max={5000000}
            step={500000}
            value={price}
            onChange={(val) => setPrice(val as [number, number])}
          />
        </Col>

        <Col xs={24} md={4}>
          <Rate value={rating} onChange={setRating} />
        </Col>

        <Col xs={24} md={4}>
          <Select value={day} onChange={setDay} style={{ width: '100%' }}>
            <Option value="day1">Day 1</Option>
            <Option value="day2">Day 2</Option>
            <Option value="day3">Day 3</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <Button type="primary" onClick={() => addToPlan(item)}>
                    Thêm vào lịch trình
                  </Button>,
                ]}
              >
                <h3>{item.name}</h3>
                <p>Loại: {item.type}</p>
                <p>Giá: {item.price.toLocaleString()} VND</p>
                <Rate disabled defaultValue={item.rating} allowHalf />
              </Card>
            </Col>
          ))
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Row>
    </div>
  );
};

export default TrangChu;