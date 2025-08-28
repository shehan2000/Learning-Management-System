import { prisma } from "@/lib/prisma"
import BigCalendar from "./BigCalender"
import { convertUTCToLocalDate } from "@/lib/utils"



const BigCalendarContainer = async({
    type,
    id
}:{
    type:"teacherId"|"classId",
    id:string|number
}) => {
    const datares=await prisma.lesson.findMany({
        where:{
            ...(type==="teacherId"
                ?{teacherId:id as string}
                :{classId:id as number})
        }
    })
    const data=datares.map(lesson=>({
        title:lesson.name,
        start: convertUTCToLocalDate(lesson.startTime), // already Date, ensure it's preserved
        end: convertUTCToLocalDate(lesson.endTime),

    }))
    console.log(data)
    console.log(data.map(item=>({start:item.start})))


    return (
    <div><BigCalendar data={data}/></div>
  )
}

export default BigCalendarContainer