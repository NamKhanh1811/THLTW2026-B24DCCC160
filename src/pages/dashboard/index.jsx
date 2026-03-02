import { Card, Statistic, Row, Col } from 'antd';
import { useModel } from 'umi';

export default function Dashboard(){
  const { dashboard } = useModel('store');

  return (
    <Row gutter={16}>
      <Col span={6}><Card><Statistic title="Tổng sản phẩm" value={dashboard.totalProducts}/></Card></Col>
      <Col span={6}><Card><Statistic title="Tổng đơn hàng" value={dashboard.totalOrders}/></Card></Col>
      <Col span={6}><Card><Statistic title="Giá trị tồn kho" value={dashboard.totalStockValue}/></Card></Col>
      <Col span={6}><Card><Statistic title="Doanh thu" value={dashboard.revenue}/></Card></Col>
    </Row>
  )
}