import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Progress, Alert, Row, Col } from 'antd';

interface BudgetData {
  total: number;
  food: number;
  transport: number;
  hotel: number;
}

interface AppData {
  filter?: any;
  plan?: any;
  budget?: BudgetData;
}

const NganSach: React.FC = () => {
  const [data, setData] = useState<BudgetData>({
    total: 5000000,
    food: 0,
    transport: 0,
    hotel: 0,
  });


  useEffect(() => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');
    if (saved.budget) setData(saved.budget);
  }, []);


  useEffect(() => {
    const saved: AppData = JSON.parse(localStorage.getItem('appData') || '{}');
    localStorage.setItem('appData', JSON.stringify({ ...saved, budget: data }));
  }, [data]);

  const spent = data.food + data.transport + data.hotel;
  const percent = data.total ? (spent / data.total) * 100 : 0;

  return (
    <div>
      <Card title="💰 Ngân sách tổng" style={{ marginBottom: 20 }}>
        <InputNumber
          value={data.total}
          onChange={(val) => setData({ ...data, total: val || 0 })}
          style={{ width: '100%' }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Ăn uống">
            <InputNumber
              value={data.food}
              onChange={(val) => setData({ ...data, food: val || 0 })}
              style={{ width: '100%' }}
            />
            <Progress percent={(data.food / data.total) * 100} strokeColor="orange" />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Di chuyển">
            <InputNumber
              value={data.transport}
              onChange={(val) => setData({ ...data, transport: val || 0 })}
              style={{ width: '100%' }}
            />
            <Progress percent={(data.transport / data.total) * 100} strokeColor="blue" />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Lưu trú">
            <InputNumber
              value={data.hotel}
              onChange={(val) => setData({ ...data, hotel: val || 0 })}
              style={{ width: '100%' }}
            />
            <Progress percent={(data.hotel / data.total) * 100} strokeColor="green" />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <h3>📊 Tổng kết</h3>
        <p>💸 Đã chi: {spent.toLocaleString()} VND</p>
        <p>📈 % sử dụng: {percent.toFixed(1)}%</p>

        <Progress percent={percent} status={spent > data.total ? 'exception' : 'active'} />

        {spent > data.total && (
          <Alert message="⚠️ Vượt ngân sách!" type="error" showIcon style={{ marginTop: 10 }} />
        )}
      </Card>
    </div>
  );
};

export default NganSach;