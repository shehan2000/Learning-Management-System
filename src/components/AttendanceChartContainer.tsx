import Image from "next/image"
import AttendanceChart from "./AttendanceChart"
import { prisma } from "@/lib/prisma"
const AttendanceChartContainer = async() => {
    const today=new Date();
    const dayOfWeek= today.getDay()
    const daySinceMonday=dayOfWeek ===0?6:dayOfWeek-1;
    const lastMonday=new Date(today);
    lastMonday.setDate(today.getDate()-daySinceMonday);
    const data=await prisma.attendence.findMany({

    })
    


  return (
    <div className="bg-white rounded-lg p-4 h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Attendance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
          <AttendanceChart/>
        </div>
  )
}

export default AttendanceChartContainer