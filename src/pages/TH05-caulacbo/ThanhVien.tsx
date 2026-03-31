import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Select, message } from 'antd';

const { Option } = Select;

const APP_KEY = 'TH05_APPLICATIONS';
const CLUB_KEY = 'TH05_CLUBS';

const getApps = () => {
  return JSON.parse(localStorage.getItem(APP_KEY) || '[]');
};

const setApps = (data: any[]) => {
  localStorage.setItem(APP_KEY, JSON.stringify(data));
};

const getClubs = () => {
  return JSON.parse(localStorage.getItem(CLUB_KEY) || '[]');
};

const ThanhVien = () => {
  const [data, setData] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apps = getApps();
    const approved = apps.filter((x: any) => x.status === 'APPROVED');
    setData(approved);
    setClubs(getClubs());
  };

  const handleChangeClub = () => {
    let newClub = '';

    Modal.confirm({
      title: `Chuyển ${selectedRowKeys.length} thành viên`,
      content: (
        <Select style={{ width: '100%' }} onChange={(v) => (newClub = v)}>
          {clubs.map((c) => (
            <Option key={c.id} value={c.name}>
              {c.name}
            </Option>
          ))}
        </Select>
      ),
      onOk() {
        if (!newClub) {
          message.error('Chọn CLB');
          return Promise.reject();
        }

        const apps = getApps();

        const newData = apps.map((item: any) =>
          selectedRowKeys.includes(item.id)
            ? { ...item, club: newClub }
            : item
        );

        setApps(newData);
        setSelectedRowKeys([]);
        loadData();
        message.success('Đã chuyển CLB');
      },
    });
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'CLB', dataIndex: 'club' },
  ];

  return (
    <div>
      <h2>Thành viên CLB</h2>

      <Button
        type="primary"
        disabled={!selectedRowKeys.length}
        onClick={handleChangeClub}
      >
        Chuyển CLB ({selectedRowKeys.length})
      </Button>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />
    </div>
  );
};

export default ThanhVien;