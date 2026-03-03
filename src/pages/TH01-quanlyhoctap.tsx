import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    List,
    Modal,
    Form,
    Select,
    DatePicker,
    InputNumber,
    Tag,
    Space,
} from "antd";
import moment from "moment";

interface SubjectItem {
    id: string;
    name: string;
}

interface SessionItem {
    id: string;
    subjectId: string;
    datetime: string;
    duration: number;
    content: string;
    note: string;
}

interface GoalItem {
    subjectId: string;
    monthlyTarget: number;
}

export default function StudyManager() {
const [listSubject, setListSubject] = useState<SubjectItem[]>([]);
const [listSession, setListSession] = useState<SessionItem[]>([]);
const [listGoal, setListGoal] = useState<GoalItem[]>([]);

const [inputName, setInputName] = useState("");
const [openModal, setOpenModal] = useState(false);

const [form] = Form.useForm();

useEffect(() => {
const dataLocal = localStorage.getItem("study-data");
if (dataLocal) {
const parsed = JSON.parse(dataLocal);
setListSubject(parsed.listSubject || []);
setListSession(parsed.listSession || []);
setListGoal(parsed.listGoal || []);
}
}, []);

useEffect(() => {
const data = {
listSubject,
listSession,
listGoal,
};
localStorage.setItem("study-data", JSON.stringify(data));
}, [listSubject, listSession, listGoal]);

const handleAddSubject = () => {
if (inputName.trim() === "") return;

const newItem: SubjectItem = {
  id: Date.now() + "",
  name: inputName,
};

setListSubject([...listSubject, newItem]);
setInputName("");

};

const handleDeleteSubject = (id: string) => {
const newSubjects = listSubject.filter((item) => item.id !== id);
const newSessions = listSession.filter((item) => item.subjectId !== id);
const newGoals = listGoal.filter((item) => item.subjectId !== id);

setListSubject(newSubjects);
setListSession(newSessions);
setListGoal(newGoals);

};

const handleAddSession = (values: any) => {
const session: SessionItem = {
id: Date.now() + "",
subjectId: values.subjectId,
datetime: values.datetime ? values.datetime.toISOString() : "",
duration: values.duration,
content: values.content,
note: values.note,
};

setListSession([...listSession, session]);
form.resetFields();
setOpenModal(false);

};

const handleSetGoal = (subjectId: string, value: number) => {
const found = listGoal.find((g) => g.subjectId === subjectId);

if (found) {
  const updated = listGoal.map((g) => {
    if (g.subjectId === subjectId) {
      return { ...g, monthlyTarget: value };
    }
    return g;
  });
  setListGoal(updated);
} else {
  setListGoal([
    ...listGoal,
    { subjectId: subjectId, monthlyTarget: value },
  ]);
}

};

const calcTotalTime = (subjectId: string) => {
const now = moment();
let total = 0;

listSession.forEach((item) => {
  if (
    item.subjectId === subjectId &&
    moment(item.datetime).month() === now.month()
  ) {
    total += item.duration;
  }
});

return total;

};

return (
<Card title="Quản lý học tập">
<Space>
<Input
placeholder="Nhập tên môn"
value={inputName}
onChange={(e) => setInputName(e.target.value)}
/>
<Button type="primary" onClick={handleAddSubject}>
Thêm
</Button>
</Space>

  <List
    bordered
    style={{ marginTop: 20 }}
    dataSource={listSubject}
    renderItem={(item) => {
      const goal = listGoal.find((g) => g.subjectId === item.id);
      const total = calcTotalTime(item.id);
      const isDone = goal ? total >= goal.monthlyTarget : false;

      return (
        <List.Item
          actions={[
            <Button danger onClick={() => handleDeleteSubject(item.id)}>
              Xóa
            </Button>,
          ]}
        >
          <div>
            <b>{item.name}</b>
            <br />
            Tổng thời gian tháng này: {total} phút
            <br />
            <InputNumber
              placeholder="Nhập mục tiêu"
              onChange={(val) =>
                handleSetGoal(item.id, Number(val))
              }
            />
            {goal && (
              <Tag color={isDone ? "green" : "red"}>
                {isDone ? "Đạt rồi" : "Chưa đạt"}
              </Tag>
            )}
          </div>
        </List.Item>
      );
    }}
  />

  <Button
    type="primary"
    style={{ marginTop: 20 }}
    onClick={() => setOpenModal(true)}
  >
    Thêm lịch học
  </Button>

  <List
    bordered
    style={{ marginTop: 20 }}
    header="Danh sách buổi học"
    dataSource={listSession}
    renderItem={(item) => {
      const subject = listSubject.find(
        (s) => s.id === item.subjectId
      );

      return (
        <List.Item
          actions={[
            <Button
              danger
              onClick={() =>
                setListSession(
                  listSession.filter((s) => s.id !== item.id)
                )
              }
            >
              Xóa
            </Button>,
          ]}
        >
          <div>
            <b>{subject ? subject.name : "Không có"}</b>
            <br />
            Thời gian:{" "}
            {moment(item.datetime).format("DD/MM/YYYY HH:mm")}
            <br />
            Thời lượng: {item.duration} phút
            <br />
            Nội dung: {item.content}
            <br />
            Ghi chú: {item.note}
          </div>
        </List.Item>
      );
    }}
  />

  <Modal
    visible={openModal}
    onCancel={() => setOpenModal(false)}
    onOk={() => form.submit()}
    title="Thêm buổi học"
  >
    <Form form={form} layout="vertical" onFinish={handleAddSession}>
      <Form.Item name="subjectId" label="Môn học" required>
        <Select>
          {listSubject.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="datetime" label="Thời gian" required>
        <DatePicker showTime />
      </Form.Item>

      <Form.Item name="duration" label="Thời lượng (phút)" required>
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item name="content" label="Nội dung">
        <Input />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input />
      </Form.Item>
    </Form>
  </Modal>
</Card>

);
}