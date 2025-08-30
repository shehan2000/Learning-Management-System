import { optional, z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1, { message: "Subject Name is Required!" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1, { message: "Class Name is Required!" }),
  capacity: z.coerce.number().min(1, { message: "Class Capacity is Required!" }),
  gradeId: z.coerce.number().min(1, { message: "Class Grade ID is Required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.coerce.string().optional(),
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters long" }).max(20,{ message: "Username must be at most 20 characters long" }),
  password: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().trim().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  name: z.string().trim().min(1, { message: "First Name is Required!" }),
  surname: z.string().trim().min(1, { message: "Last Name is Required!" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  img:z.string().optional(),
  bloodType: z.string().trim().min(2, { message: "Blood Type must be at least 2 characters long" }).max(3, { message: "Blood Type must be at most 3 characters long" }),
  birthday: z.coerce.date({message:"Birthday is required"}),
  sex: z.enum(["Male", "Female"], { message: "Sex is required" }),
  subjects:z.array(z.string()).optional(),// we include subject ids here
  
});

export type TeacherSchema = z.infer<typeof teacherSchema>;
