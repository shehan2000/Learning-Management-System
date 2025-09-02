"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState} from "react-dom"
import InputField from "../InputField";
import { ClassSchema, SubjectSchema, classSchema, subjectSchema as schema } from "@/lib/formValidationSchemas";
import { createClass, updateClass} from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";




const ClassForm = ({
  setOpen,
  type,
  data,
  relatedData,

}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
  
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });
  const [state, formAction] = useFormState(type==="create"? createClass:updateClass,{success:false,error:false});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);

  });

  const router=useRouter();
  useEffect(()=>{
    if(state.success){
      toast(`Class has been ${type === "create" ? "created" : "updated"} successfully!`)
      setOpen(false);
      router.refresh();
    }
  },[state, router, setOpen, type])

  const {teachers,grades}=relatedData|| [];
  // const {teachers}=relatedData;


  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new Class" : "Update Class"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Class capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.name}
        />
        {data &&(<InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />)}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisors</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId}
          >
            {teachers.map((teacher:{id:string,name:string,surname:string})=>(
            <option key={teacher.id} value={teacher.id} selected={data && teacher.id === data.supervisorId}>{teacher.name + " " + teacher.surname}</option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade:{id:number,level:number})=>(
            <option key={grade.id} value={grade.id} selected={data && grade.id === data.gradeId}>{grade.level}</option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

      </div>

{state.error && <span className="text-red-500">Something Went Wrong!</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;