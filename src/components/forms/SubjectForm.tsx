"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState} from "react-dom"
import InputField from "../InputField";
import { SubjectSchema, subjectSchema as schema } from "@/lib/formValidationSchemas";
import { createSubject } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";




const SubjectForm = ({
  setOpen,
  type,
  data,
  
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(schema),
  });
  const [state, formAction] = useFormState(createSubject,{success:false,error:false});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);

  });

  const router=useRouter();
  useEffect(()=>{
    if(state.success){
      toast(`Subject has been ${type === "create" ? "created" : "updated"} successfully!`)
      setOpen(false);
      router.refresh();
    }
  },[state])


  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new Subject" : "Update Subject"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

      </div>

{state.error && <span className="text-red-500">Something Went Wrong!</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;