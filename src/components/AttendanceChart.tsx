"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";



const AttendanceChart = ({present,absent}:{present:number[],absent:number[]}) => {
  const data = [
  {
    name: "Mon",
    present: present[0]?present[0]:0,
    absent: absent[0]?absent[0]:0,
  },
  {
    name: "Tue",
    present: present[1]?present[1]:1,
    absent: absent[1]?absent[1]:1,
  },
  {
    name: "Wed",
    present: present[2]?present[2]:2,
    absent: absent[2]?absent[2]:2,
  },
  {
    name: "Thu",
    present: present[3]?present[3]:3,
    absent: absent[3]?absent[3]:3,
  },
  {
    name: "Fri",
    present: 65,
    absent: 55,
  },
];
  return (
    
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="present"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    
  );
};

export default AttendanceChart;