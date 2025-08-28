// lib/authUtils.ts
import { auth } from "@clerk/nextjs/server";

export async function getUserSessionData() {
  const authObject = await auth();
  const role = (authObject.sessionClaims?.metadata as { role?: string })?.role;
  const userId = authObject.userId;
  return { role, userId };
}

export async function getUserRole() {
  const { role } = await getUserSessionData();
  return role;
}

export async function getUserId() {
  const { userId } = await getUserSessionData();
  return userId;
}
export const convertUTCToLocalDate = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000; // e.g. -330 mins for SL
  return new Date(date.getTime() + offsetMs); // shift backward, to treat as local
}

const currentWorkWeek = () => {
  const today=new Date();
  const dayofWeek=today.getDay(); //0-6, Sun-Sat
  const startOfWeek=new Date(today)
  
  if(dayofWeek===0){
    startOfWeek.setDate(today.getDate()+1);
  }
  if(dayofWeek===6){
    startOfWeek.setDate(today.getDate()+2);
  }else{
    startOfWeek.setHours(0,0,0,0);
  }
  return startOfWeek;
};

export const adjustScheduleToCurrentWeek=(lessons:{title:string;start:Date;end:Date}[]):{title:string;start:Date;end:Date}[]=>{

  const startOfWeek = currentWorkWeek();

  return lessons.map(lesson => {
    const lessonDayOfWeek=lesson.start.getDay();
    const daysFromMonday=lessonDayOfWeek===0?6:lessonDayOfWeek-1;

    const adjustedStartDate= new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate()+daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
    );

    const adjustedEndDate= new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
    )

    return { title:lesson.title, start: adjustedStartDate, end: adjustedEndDate };
  });
};
