import Image from "next/image"
import AttendanceChart from "./AttendanceChart"
import { prisma } from "@/lib/prisma"
const AttendanceChartContainer = async() => {
    const today=new Date();
    const dayOfWeek= today.getDay()
    const daySinceMonday=dayOfWeek ===0?6:dayOfWeek;
    const lastMonday=new Date(today);
    lastMonday.setDate(today.getDate()-daySinceMonday);
    const resdata=await prisma.attendence.findMany({
        where:{
            date:{
                gte:lastMonday,
            },
        },
            select:{
                date:true,
                present:true,
            
        },

    })
    // console.log("d",data)

    const daysOfWeek =["Mon","Tue","Wed","Thu","Fri"]
    const attendanceMap:{[key:string]:{present:number,absent:number}}={
        Mon:{present:0,absent:0},
        Tue:{present:0,absent:0},
        Wed:{present:0,absent:0},
        Thu:{present:0,absent:0},
        Fri:{present:0,absent:0},
    }

    resdata.forEach((attendance) => {
        const day = new Date(attendance.date);
        if(dayOfWeek>=1 && dayOfWeek<=5)
            
            {
            const dayName=daysOfWeek[dayOfWeek-1];
            if (attendance.present) {
                attendanceMap[dayName].present++;
            } else {
                attendanceMap[dayName].absent++;
            }
        }
    });
    // console.log("attendance map",attendanceMap)
    const data= daysOfWeek.map(
        (day)=>({
            name:day,
            present:attendanceMap[day].present,
            absent:attendanceMap[day].absent
        })
    );

  return (
    <div className="bg-white rounded-lg p-4 h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Attendance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
          <AttendanceChart data={data} />
        </div>
  )
}

export default AttendanceChartContainer