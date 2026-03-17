import { useEffect, useState } from "react";
import { Table } from "antd";

export default function ThongKe(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [services,setServices] = useState<any[]>([])

  useEffect(()=>{

    const a = localStorage.getItem("appointments")
    const s = localStorage.getItem("services")

    if(a){
      setAppointments(JSON.parse(a))
    }

    if(s){
      setServices(JSON.parse(s))
    }

  },[])

  const getPrice = (name:string)=>{

    const service = services.find(
      (s)=> s.name === name
    )

    return service ? service.price : 0
  }


  const dateMap:any = {}

  appointments.forEach((a)=>{

    if(!dateMap[a.date]){
      dateMap[a.date] = 0
    }

    dateMap[a.date]++

  })

  const dataByDate = Object.keys(dateMap).map((d)=>({
    date:d,
    total:dateMap[d]
  }))

  const monthMap:any = {}

  appointments.forEach((a)=>{

    const month = a.date.slice(0,7)

    if(!monthMap[month]){
      monthMap[month] = 0
    }

    monthMap[month]++

  })

  const dataByMonth = Object.keys(monthMap).map((m)=>({
    month:m,
    total:monthMap[m]
  }))


  const serviceMap:any = {}

  appointments.forEach((a)=>{

    if(a.status !== "Hoàn thành") return

    const price = getPrice(a.service)

    if(!serviceMap[a.service]){
      serviceMap[a.service] = 0
    }

    serviceMap[a.service] += price

  })

  const dataService = Object.keys(serviceMap).map((s)=>({
    service:s,
    revenue:serviceMap[s]
  }))

  const employeeMap:any = {}

  appointments.forEach((a)=>{

    if(a.status !== "Hoàn thành") return

    const price = getPrice(a.service)

    if(!employeeMap[a.employee]){
      employeeMap[a.employee] = 0
    }

    employeeMap[a.employee] += price

  })

  const dataEmployee = Object.keys(employeeMap).map((e)=>({
    employee:e,
    revenue:employeeMap[e]
  }))


  return(

    <div>

      <h3>Thống kê lịch theo ngày</h3>

      <Table
        columns={[
          {title:"Ngày",dataIndex:"date"},
          {title:"Số lịch",dataIndex:"total"}
        ]}
        dataSource={dataByDate}
        rowKey="date"
        pagination={false}
        style={{marginBottom:40}}
      />


      <h3>Thống kê lịch theo tháng</h3>

      <Table
        columns={[
          {title:"Tháng",dataIndex:"month"},
          {title:"Số lịch",dataIndex:"total"}
        ]}
        dataSource={dataByMonth}
        rowKey="month"
        pagination={false}
        style={{marginBottom:40}}
      />


      <h3>Doanh thu theo dịch vụ</h3>

      <Table
        columns={[
          {title:"Dịch vụ",dataIndex:"service"},
          {title:"Doanh thu",dataIndex:"revenue"}
        ]}
        dataSource={dataService}
        rowKey="service"
        pagination={false}
        style={{marginBottom:40}}
      />


      <h3>Doanh thu theo nhân viên</h3>

      <Table
        columns={[
          {title:"Nhân viên",dataIndex:"employee"},
          {title:"Doanh thu",dataIndex:"revenue"}
        ]}
        dataSource={dataEmployee}
        rowKey="employee"
        pagination={false}
      />

    </div>
  )
}