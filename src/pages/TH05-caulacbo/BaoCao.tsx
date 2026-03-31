import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'antd';

const APP_KEY = 'TH05_APPLICATIONS';
const CLUB_KEY = 'TH05_CLUBS';

function getAppsLocal() {
  let tmp = localStorage.getItem(APP_KEY);
  if (!tmp) return [];
  try {
    return JSON.parse(tmp);
  } catch(e) {
    console.log('JSON apps lỗi nè', e);
    return [];
  }
}

function getClubsLocal() {
  let tmp = localStorage.getItem(CLUB_KEY);
  if (!tmp) return [];
  try {
    return JSON.parse(tmp);
  } catch(e) {
    console.log('JSON clubs lỗi nè', e);
    return [];
  }
}

const BaoCao = () => {

  const [tongQuan, setTongQuan] = useState({
    tongCLB:0,
    pending:0,
    approved:0,
    rejected:0
  });

  const [bieuDo, setBieuDo] = useState<any[]>([]);

  useEffect(()=>{
    loadAllData();
  },[])

  const loadAllData = () => {
    let arrApps = getAppsLocal();
    let arrClubs = getClubsLocal();

    let pendingC=0, approvedC=0, rejectedC=0;
    for(let i=0;i<arrApps.length;i++){
      let a = arrApps[i];
      if(a.status==='PENDING') pendingC++;
      else if(a.status==='APPROVED') approvedC++;
      else if(a.status==='REJECTED') rejectedC++;
    }

    setTongQuan({
      tongCLB: arrClubs.length,
      pending: pendingC,
      approved: approvedC,
      rejected: rejectedC
    });

    let tmpTable:any[] = [];
    for(let i=0;i<arrClubs.length;i++){
      let clubX = arrClubs[i];
      let appsOfClub:any[] = [];
      for(let j=0;j<arrApps.length;j++){
        if(arrApps[j].club===clubX.name) appsOfClub.push(arrApps[j]);
      }

      let p=0,a=0,r=0;
      for(let k=0;k<appsOfClub.length;k++){
        let b = appsOfClub[k];
        if(b.status==='PENDING') p++;
        else if(b.status==='APPROVED') a++;
        else if(b.status==='REJECTED') r++;
      }

      tmpTable.push({
        key: clubX.id,
        club: clubX.name,
        pending: p,
        approved: a,
        rejected: r
      })
    }

    console.log('Bảng theo CLB:', tmpTable);
    setBieuDo(tmpTable);
  }

  const columns = [
    {title:'Tên CLB', dataIndex:'club'},
    {title:'Pending', dataIndex:'pending'},
    {title:'Approved', dataIndex:'approved'},
    {title:'Rejected', dataIndex:'rejected'}
  ];

  return (
    <div style={{padding:20}}>
      <h2>Báo cáo & Thống kê</h2>

      <Row gutter={16} style={{marginBottom:20}}>
        <Col span={6}>
          <Card title="Tổng CLB">{tongQuan.tongCLB}</Card>
        </Col>
        <Col span={6}>
          <Card title="Pending">{tongQuan.pending}</Card>
        </Col>
        <Col span={6}>
          <Card title="Approved">{tongQuan.approved}</Card>
        </Col>
        <Col span={6}>
          <Card title="Rejected">{tongQuan.rejected}</Card>
        </Col>
      </Row>

      <Card title="Thống kê theo CLB">
        <Table
          columns={columns}
          dataSource={bieuDo}
          pagination={false}
        />
      </Card>

      {console.log('Render component rùi')}
    </div>
  )
}

export default BaoCao;