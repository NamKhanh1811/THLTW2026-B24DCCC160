import { Table, Button, Modal, Form, Input, DatePicker, Select, Space } from "antd";
import { useState, useEffect } from "react";

export default function LichHen() {

  const [appointments,setAppointments] = useState<any[]>([])
  const [employees,setEmployees] = useState<any[]>([])
  const [services,setServices] = useState<any[]>([])
  const [visible,setVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(()=>{

    const appointmentsData = localStorage.getItem("appointments")
    const employeesData = localStorage.getItem("employees")
    const servicesData = localStorage.getItem("services")

    if(appointmentsData){
      setAppointments(JSON.parse(appointmentsData))
    }

    if(employeesData){
      setEmployees(JSON.parse(employeesData))
    }

    if(servicesData){
      setServices(JSON.parse(servicesData))
    }

  },[])

  useEffect(()=>{
    localStorage.setItem("appointments",JSON.stringify(appointments))
  },[appointments])

  const addAppointment = (values:any) => {

    const newDate = values.date.format("YYYY-MM-DD")

    const employee = employees.find(
        (e)=> e.name === values.employee
    )

    if(!employee){
        alert("Không tìm thấy nhân viên")
        return
    }

    const count = appointments.filter(
        (a)=>
        a.employee === values.employee &&
        a.date === newDate &&
        a.status !== "Hủy"
    ).length

    if(count >= employee.maxPerDay){
        alert(`Nhân viên đã đủ ${employee.maxPerDay} khách trong ngày`)
        return
    }

    const newAppointment = {
        id:Date.now(),
        customer:values.customer,
        employee:values.employee,
        service:values.service,
        date:newDate,
        status:"Chờ duyệt"
    }

    setAppointments([...appointments,newAppointment])

    setVisible(false)
    form.resetFields()
  }

  const updateStatus = (id:number,status:string)=>{

    const newData = appointments.map((a)=>{
      if(a.id === id){
        return {...a,status}
      }
      return a
    })

    setAppointments(newData)
  }


  const columns = [
    {title:"Khách hàng",dataIndex:"customer"},
    {title:"Dịch vụ",dataIndex:"service"},
    {title:"Nhân viên",dataIndex:"employee"},
    {title:"Ngày",dataIndex:"date"},
    {title:"Trạng thái",dataIndex:"status"},

    {
      title:"Hành động",
      render:(_:any,record:any)=>(
        <Space>

          <Button
            size="small"
            onClick={()=>updateStatus(record.id,"Xác nhận")}
          >
            Xác nhận
          </Button>

          <Button
            size="small"
            onClick={()=>updateStatus(record.id,"Hoàn thành")}
          >
            Hoàn thành
          </Button>

          <Button
            danger
            size="small"
            onClick={()=>updateStatus(record.id,"Hủy")}
          >
            Hủy
          </Button>

        </Space>
      )
    }

  ]

  return (
    <div>

      <Button type="primary" onClick={()=>setVisible(true)}>
        Đặt lịch
      </Button>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        style={{marginTop:20}}
      />

      <Modal
        visible={visible}
        onCancel={()=>setVisible(false)}
        onOk={()=>form.submit()}
        title="Đặt lịch"
      >

        <Form form={form} onFinish={addAppointment} layout="vertical">

          <Form.Item
            name="customer"
            label="Khách hàng"
            rules={[{required:true}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="service"
            label="Dịch vụ"
            rules={[{required:true}]}
          >
            <Select
              placeholder="Chọn dịch vụ"
              options={services.map((s)=>({
                value:s.name,
                label:`${s.name} - ${s.price}đ`
              }))}
            />
          </Form.Item>

          <Form.Item
            name="employee"
            label="Nhân viên"
            rules={[{required:true}]}
          >
            <Select
              placeholder="Chọn nhân viên"
              options={employees.map((e)=>({
                value:e.name,
                label:e.name
              }))}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{required:true}]}
          >
            <DatePicker style={{width:"100%"}}/>
          </Form.Item>

        </Form>

      </Modal>

    </div>
  )
}