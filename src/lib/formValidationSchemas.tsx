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
