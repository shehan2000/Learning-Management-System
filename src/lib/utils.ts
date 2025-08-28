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

