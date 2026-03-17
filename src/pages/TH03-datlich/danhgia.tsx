import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Rate} from "antd";

export default function DanhGia() {

  const [appointments,setAppointments] = useState<any[]>([])
  const [reviews,setReviews] = useState<any[]>([])
  const [visible,setVisible] = useState(false)
  const [selected,setSelected] = useState<any>(null)

  const [form] = Form.useForm()

  useEffect(()=>{

    const a = localStorage.getItem("appointments")
    const r = localStorage.getItem("reviews")

    if(a){
      setAppointments(JSON.parse(a))
    }

    if(r){
      setReviews(JSON.parse(r))
    }

  },[])

  useEffect(()=>{
    localStorage.setItem("reviews",JSON.stringify(reviews))
  },[reviews])

  const openReview = (record:any)=>{
    setSelected(record)
    setVisible(true)
  }

  const submitReview = (values:any)=>{

    const newReview = {
      id:Date.now(),
      appointmentId:selected.id,
      employee:selected.employee,
      service:selected.service,
      rating:values.rating,
      comment:values.comment,
      reply:""
    }

    setReviews([...reviews,newReview])

    setVisible(false)
    form.resetFields()
  }


  const replyReview = (id:number)=>{

    const text = prompt("Nhập phản hồi")

    if(!text) return

    const newData = reviews.map((r)=>{
      if(r.id === id){
        return {...r,reply:text}
      }
      return r
    })

    setReviews(newData)
  }

  const avgRating = (employee:string)=>{

    const empReviews = reviews.filter(
      (r)=> r.employee === employee
    )

    if(empReviews.length === 0) return 0

    const total = empReviews.reduce(
      (sum,r)=> sum + r.rating,0
    )

    return (total / empReviews.length).toFixed(1)
  }

  const columnsAppointments = [

    {title:"Khách",dataIndex:"customer"},
    {title:"Nhân viên",dataIndex:"employee"},
    {title:"Dịch vụ",dataIndex:"service"},
    {title:"Ngày",dataIndex:"date"},
    {title:"Trạng thái",dataIndex:"status"},

    {
      title:"Đánh giá",
      render:(_:any,record:any)=>{

        if(record.status !== "Hoàn thành"){
          return "-"
        }

        const reviewed = reviews.find(
          (r)=> r.appointmentId === record.id
        )

        if(reviewed){
          return "Đã đánh giá"
        }

        return(
          <Button
            size="small"
            onClick={()=>openReview(record)}
          >
            Đánh giá
          </Button>
        )
      }
    }

  ]


  const columnsReviews = [

    {title:"Nhân viên",dataIndex:"employee"},

    {
      title:"Sao",
      dataIndex:"rating",
      render:(v:number)=> <Rate disabled value={v}/>
    },

    {title:"Nhận xét",dataIndex:"comment"},

    {title:"Phản hồi",dataIndex:"reply"},

    {
      title:"Hành động",
      render:(_:any,record:any)=>(
        <Button
          size="small"
          onClick={()=>replyReview(record.id)}
        >
          Phản hồi
        </Button>
      )
    }

  ]


  const employees = [...new Set(reviews.map(r=>r.employee))]


  return (

    <div>

      <h2>Lịch hẹn hoàn thành</h2>

      <Table
        columns={columnsAppointments}
        dataSource={appointments}
        rowKey="id"
        style={{marginBottom:40}}
      />


      <h2>Danh sách đánh giá</h2>

      <Table
        columns={columnsReviews}
        dataSource={reviews}
        rowKey="id"
      />


      <h2>Điểm trung bình nhân viên</h2>

      {employees.map((emp)=>(
        <div key={emp}>
          {emp} : ⭐ {avgRating(emp)}
        </div>
      ))}


      <Modal
        visible={visible}
        onCancel={()=>setVisible(false)}
        onOk={()=>form.submit()}
        title="Đánh giá dịch vụ"
      >

        <Form form={form} onFinish={submitReview} layout="vertical">

          <Form.Item
            name="rating"
            label="Số sao"
            rules={[{required:true}]}
          >
            <Rate/>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét"
          >
            <Input.TextArea/>
          </Form.Item>

        </Form>

      </Modal>

    </div>
  )
}