"use server";

import { clerkClient } from "@clerk/nextjs/server";
import {
  ClassSchema,
  SubjectSchema,
  TeacherSchema,
  StudentSchema,
  ExamSchema,
} from "./formValidationSchemas";
import { prisma } from "./prisma";
import { getUserId, getUserRole } from "./utils";

type CurrentState = {
  success: boolean;
  error: boolean;
  message?: string;
  code?: string | null;
};
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  console.log(data.name + "in the server action");
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  console.log(data.name + "in the server action");
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  console.log(JSON.stringify(data), "in the server action");
  try {
    await prisma.class.create({
      data,
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  console.log(data.name + "in the server action");
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId,
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  console.log(JSON.stringify(data), "in the server action");
  try {
    // Pre-check common identifier collisions locally to return a friendly
    // error instead of letting Clerk fail with form_identifier_exists.
    const usernameTaken =
      (await prisma.teacher.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.student.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.parent.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.admin.findUnique({ where: { username: data.username } }));
    if (usernameTaken) {
      return {
        success: false,
        error: true,
        code: "form_identifier_exists",
        message: "Username already exists",
      } as any;
    }
    if (data.email) {
      const emailTaken =
        (await prisma.teacher.findUnique({ where: { email: data.email } })) ||
        (await prisma.student.findUnique({ where: { email: data.email } })) ||
        (await prisma.parent.findUnique({ where: { email: data.email } }));
      if (emailTaken) {
        return {
          success: false,
          error: true,
          code: "form_identifier_exists",
          message: "Email already exists",
        } as any;
      }
    }
    // clerkClient is an async initializer; await it to get the client instance
    const client = await clerkClient();

    // Create the user in Clerk first. If this fails (for example the password
    // has been found in a data breach), catch the error below and return a
    // structured response so the server action does not throw an unhandled
    // exception to the Next.js renderer.
    let user;
    try {
      user = await client.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
      });
    } catch (err: any) {
      // Don't log the entire error object (it prints the stack). Extract a
      // concise code and message to return to the caller so the UI can show
      // a friendly error without spamming the server logs with stacks.
      const code = err?.errors?.[0]?.code ?? null;
      const message =
        err?.errors?.[0]?.message ?? err?.message ?? "Failed to create user";
      console.error("Clerk createUser failed:", code ?? message);
      return { success: false, error: true, code, message } as any;
    }

    // Update metadata and then create the teacher record in our database.
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "teacher" },
    });
    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    // Outer catch: ensure we return a structured failure. If the error has a
    // message, include it so the caller can surface it.
    const message = (err as any)?.message ?? "Unknown server error";
    console.error("createTeacher outer error:", message);
    return { success: false, error: true, message } as any;
  }
};
export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  console.log(data.name + "in the server action");
  try {
    const client = await clerkClient();

    // Create the user in Clerk first. If this fails (for example the password
    // has been found in a data breach), catch the error below and return a
    // structured response so the server action does not throw an unhandled
    // exception to the Next.js renderer.
    let user;
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: "User ID is required for update",
      } as any;
    }
    try {
      user = await client.users.updateUser(data.id, {
        username: data.username,
        ...(data.password !== "" && { password: data.password }),
        firstName: data.name,
        lastName: data.surname,
      });
    } catch (err: any) {
      // Don't log the entire error object (it prints the stack). Extract a
      // concise code and message to return to the caller so the UI can show
      // a friendly error without spamming the server logs with stacks.
      const code = err?.errors?.[0]?.code ?? null;
      const message =
        err?.errors?.[0]?.message ?? err?.message ?? "Failed to create user";
      console.error("Clerk createUser failed:", code ?? message);
      return { success: false, error: true, code, message } as any;
    }

    // Update metadata and then create the teacher record in our database.
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "teacher" },
    });
    await prisma.teacher.update({
      where: { id: data.id || "" },
      data: {
        // Password is managed by Clerk; do not send it to Prisma (no column).
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          // Replace the subjects relation with the provided list (empty -> none)
          set:
            data.subjects?.map((subjectId: string) => ({
              id: parseInt(subjectId),
            })) ?? [],
        },
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem._count.students === classItem.capacity) {
      return { success: false, error: true, message: "Class capacity full" };
    }

    console.log(JSON.stringify(data), "in the server action");

    // clerkClient is an async initializer; await it to get the client instance
    // Pre-check identifiers locally to avoid Clerk "form_identifier_exists"
    const usernameTaken =
      (await prisma.student.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.teacher.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.parent.findUnique({
        where: { username: data.username },
      })) ||
      (await prisma.admin.findUnique({ where: { username: data.username } }));
    if (usernameTaken) {
      return {
        success: false,
        error: true,
        code: "form_identifier_exists",
        message: "Username already exists",
      } as any;
    }

    const client = await clerkClient();

    // Create the user in Clerk first. If this fails (for example the password
    // has been found in a data breach), catch the error below and return a
    // structured response so the server action does not throw an unhandled
    // exception to the Next.js renderer.
    let user;
    try {
      user = await client.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
      });
    } catch (err: any) {
      // Don't log the entire error object (it prints the stack). Extract a
      // concise code and message to return to the caller so the UI can show
      // a friendly error without spamming the server logs with stacks.
      const code = err?.errors?.[0]?.code ?? null;
      const message =
        err?.errors?.[0]?.message ?? err?.message ?? "Failed to create user";
      console.error("Clerk createUser failed:", code ?? message);
      return { success: false, error: true, code, message } as any;
    }

    // Update metadata and then create the student record in our database.
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "student" },
    });
    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    // Outer catch: ensure we return a structured failure. If the error has a
    // message, include it so the caller can surface it.
    const message = (err as any)?.message ?? "Unknown server error";
    console.error("createTeacher outer error:", message);
    return { success: false, error: true, message } as any;
  }
};
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data.name + "in the server action");
  try {
    const client = await clerkClient();

    // Create the user in Clerk first. If this fails (for example the password
    // has been found in a data breach), catch the error below and return a
    // structured response so the server action does not throw an unhandled
    // exception to the Next.js renderer.
    let user;
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: "User ID is required for update",
      } as any;
    }
    try {
      user = await client.users.updateUser(data.id, {
        username: data.username,
        ...(data.password !== "" && { password: data.password }),
        firstName: data.name,
        lastName: data.surname,
      });
    } catch (err: any) {
      // Don't log the entire error object (it prints the stack). Extract a
      // concise code and message to return to the caller so the UI can show
      // a friendly error without spamming the server logs with stacks.
      const code = err?.errors?.[0]?.code ?? null;
      const message =
        err?.errors?.[0]?.message ?? err?.message ?? "Failed to create user";
      console.error("Clerk createUser failed:", code ?? message);
      return { success: false, error: true, code, message } as any;
    }

    // Update metadata and then create the teacher record in our database.
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "student" },
    });
    await prisma.student.update({
      where: { id: data.id || "" },
      data: {
        // Password is managed by Clerk; do not send it to Prisma (no column).
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });
    // revalidatePath("/list/class")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  console.log(data.name + "in the server action");
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  console.log(data.name + "in the server action");
  try {
    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const userId=await getUserId();
  const role = await getUserRole();
  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role==="teacher"?{lesson:{teacherId:userId!}}:{})
      },
    });
    // revalidatePath("/list/subjects")
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
