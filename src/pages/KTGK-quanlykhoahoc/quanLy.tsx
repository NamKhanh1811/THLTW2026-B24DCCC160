import { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Select, InputNumber, Popconfirm, message, Tag } from "antd";

enum TrangThai {
  DANG_MO = "DANG_MO",
  DA_DONG = "DA_DONG",
  TAM_DUNG = "TAM_DUNG",
}

interface KhoaHoc {
  id: string;
  ten: string;
  giangVien: string;
  soHocVien: number;
  trangThai: TrangThai;
  moTa?: string;
}

const KEY = "khoaHocOnl";

export default function KTGK() {
  const [data, setData] = useState<KhoaHoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<KhoaHoc | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  // dung local storage de luu lai du lieu luc reload hoac chuyen trang ko bi mat du lieu   
  useEffect(() => {
    const layDuLieu = localStorage.getItem(KEY);
    if (layDuLieu) {
      try {
        setData(JSON.parse(layDuLieu));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const showDuLieu = data.filter((x) =>
    x.ten.toLowerCase().includes(search.toLowerCase())
  );

  const luu = (values: any) => {
    const trungTen = data.find(
      (x) => x.ten === values.ten && x.id !== editItem?.id
    );

    if (trungTen) {
      message.error("Tên khóa học đã tồn tại");
      return;
    }

    if (editItem) {
      const duLieuMoi = data.map((x) =>
        x.id === editItem.id ? { ...editItem, ...values } : x
      );
      setData(duLieuMoi);
    } else {
      setData([
        ...data,
        { ...values, id: Date.now().toString() },
      ]);
    }

    setOpen(false);
    setEditItem(null);
    form.resetFields();
  };

  const xoa = (item: KhoaHoc) => {
    if (item.soHocVien > 0) {
      message.warning("Không xóa vì đã có học viên");
      return;
    }
    setData(data.filter((x) => x.id !== item.id));
  };

  const renderTrangThai = (s: TrangThai) => {
    if (s === TrangThai.DANG_MO)
      return <Tag color="green">Đang mở</Tag>;
    if (s === TrangThai.DA_DONG)
      return <Tag color="red">Đã kết thúc</Tag>;
    return <Tag color="orange">Tạm dừng</Tag>;
  };

 
  const listGV = [
    "Phan Quang Thanh",
    "Nguyen Nam Khanh",
    "Nguyen Van A",
    "Le Thi B",
  ]

  return (
    <div>
      <h3>Quản lý khóa học online</h3>

      <Input
        placeholder="Tìm theo tên..."
        style={{ width: 250, marginBottom: 10 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button
        type="primary"
        onClick={() => {
          setEditItem(null);
          setOpen(true);
          form.resetFields();
        }}
      >
        Thêm khóa học
      </Button>

      <Table
        rowKey="id"
        dataSource={showDuLieu}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Tên khóa học", dataIndex: "ten" },

          {
            title: "Giảng viên",
            dataIndex: "giangVien",
            filters: listGV.map((g) => ({
              text: g,
              value: g,
            })),
            onFilter: (v, r) => r.giangVien === v,
          },

          {
            title: "Số học viên",
            dataIndex: "soHocVien",
            sorter: (a, b) => a.soHocVien - b.soHocVien,
          },

          {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: renderTrangThai,
            filters: [
              { text: "Đang mở", value: TrangThai.DANG_MO },
              { text: "Đã kết thúc", value: TrangThai.DA_DONG },
              { text: "Tạm dừng", value: TrangThai.TAM_DUNG },
            ],
            onFilter: (v, r) => r.trangThai === v,
          },

          {
            title: "Thao tác",
            render: (_, record: KhoaHoc) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setEditItem(record);
                    setOpen(true);
                    form.setFieldsValue(record);
                  }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Xác nhận xóa?"
                  onConfirm={() => xoa(record)}
                >
                  <Button danger size="small" style={{ marginLeft: 8 }}>
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        visible={open}
        title="Thông tin khóa học"
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={luu}>
          <Form.Item
            name="ten"
            label="Tên khóa học"
            rules={[{ required: true }, { max: 100 }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="giangVien"
            label="Giảng viên"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn giảng viên">
              {listGV.map((g) => (
                <Select.Option key={g} value={g}>
                  {g}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="soHocVien"
            label="Số học viên"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="moTa" label="Mô tả (HTML)">
            <Input.TextArea placeholder="<p>Nội dung HTML</p>" />
          </Form.Item>

          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={TrangThai.DANG_MO}>
                Đang mở
              </Select.Option>
              <Select.Option value={TrangThai.DA_DONG}>
                Đã kết thúc
              </Select.Option>
              <Select.Option value={TrangThai.TAM_DUNG}>
                Tạm dừng
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 