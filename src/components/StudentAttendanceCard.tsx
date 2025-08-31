import { prisma } from "@/lib/prisma";
import { date } from "zod";

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await prisma.attendence.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  let percent = 0;
  if (
    typeof presentDays === "number" &&
    typeof totalDays === "number" &&
    totalDays > 0
  ) {
    const raw = (presentDays / totalDays) * 100;
    percent = Number.isFinite(raw) ? Math.round(raw) : 0;
  }
  return (
    <div className="">
      <h1 className="text-xl font-semibold">{percent===0?"-":String(percent) + "%"}</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
