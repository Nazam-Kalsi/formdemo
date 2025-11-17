
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm,useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState } from "react";
import { format } from 'date-fns'
import { Calendar } from "./components/ui/calendar";
import { X } from "lucide-react";

const schema = z.object({
name: z.string().min(2, { message: "Name must be at least 2 characters" }),
email: z.string().email({ message: "Enter a valid email address" }),
age: z.string().min(1, { message: "Age is required" }),
dob: z.string().min(1, { message: "Date of birth is required" }),
maritalStatus: z.string().min(1, { message: "Select marital status" }),
skills: z.string().min(3, { message: "Enter at least 3 characters" }),
gender: z.string().min(1, { message: "Select your gender" }),
country: z.string().min(1, { message: "Select a country" }),
city: z.string().min(1, { message: "City is required" }),
address: z.string().min(5, { message: "Address must be at least 5 characters" }),
category: z.string().min(1, { message: "Please select a category" }),
phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
salary: z.string().optional(),
experience: z.string().optional(),
preferredShift: z.string().optional(),
remote: z.boolean().optional(),
feedbackType: z.string().optional(),
severity: z.string().optional(),
extraInfo: z.string().optional(),
agree: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
password: z.string().min(6, { message: "Password must be at least 6 characters" }),
otp: z.string().length(4),
tags: z.array(z.string()).optional(),
files: z.any().optional(),
experiences: z.array(z.object({ company: z.string(), years: z.string() })).optional(),
})


export default function DynamicLargeForm() {
  const { register, handleSubmit, watch, setValue,control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      age: "",
      dob: "",
      maritalStatus: "",
      skills: "",
      gender: "",
      country: "",
      city: "",
      address: "",
      category: "",
      phone: "",
      salary: "",
      experience: "",
      preferredShift: "",
      remote: false,
      feedbackType: "",
      severity: "",
      extraInfo: "",
      agree: false,
      experiences: [{ company: '', years: '' }],
    }
  });

  const category = watch("category");
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [tags, setTags] = useState<string[]>([])
  const { fields, append, remove } = useFieldArray({ control, name: 'experiences' })

  const onSubmit = (data:any) => {
    toast.success( "Form submitted successfully!");
    console.log(data);
  };

  return (
    <div className="max-w-4xl mx-auto m-6 p-8 bg-linear-to-br from-gray-50 to-white shadow-2xl rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-center">Form Demo</h1>

      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <div className="flex gap-4">
        <div className="space-y-2 grow">
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2 grow">
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        </div>
        
        <div className="space-y-2">
          <Label>Password</Label>
        <Input type="password" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        
        
        {/* TAG INPUT */}
        <div className='space-y-2'>
          <Label>Multi Add</Label>
        <Input placeholder="Add tag and hit Enter" onKeyDown={(e:any)=>{
        if(e.key==='Enter'){
        e.preventDefault();
        setTags([...tags, e.target.value]);
        e.target.value='';
        }
        }} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {tags.map((t,i)=>(<span key={i} className="px-3 py-1 bg-black text-white rounded-lg gap-2 flex items-center">{t} <X size={18} onClick={()=>setTags(tags.filter((_,j)=>j!==i))}/></span>))}
        </div>
        </div>
        
        <div className="flex gap-4 items-end">
        <div className="space-y-2 w-full">
          <Label>OTP</Label>
        <div className="flex items-center justify-start gap-2">
        {[0,1,2,3,4,5].map((i)=>(<Input key={i} maxLength={1} className = 'max-w-14 text-center' {...register(`otp.${i}`)} />))}
        </div>
        </div>
        <div className="space-y-2 flex flex-col w-full">
          <Label>Pick Data</Label>
        <Popover>
        <PopoverTrigger asChild>
        <Button variant="outline">{dateRange.from ? format(dateRange.from,'PPP') : 'Pick Date'}</Button>
        </PopoverTrigger>
        <PopoverContent><Calendar mode="range" onSelect={(setDateRange as any)} /></PopoverContent>
        </Popover>
      </div>
      </div>
        
        
        {/* DRAG & DROP UPLOAD */}
        
        <div className="space-y-2">
        <Label>Upload File</Label>
        <input type="file" className="border-2 border-dashed p-6 rounded-xl text-center w-full" multiple {...register('files')} />
        </div>

        
        
        {/* REPEATER FIELDS */}
        <div className="space-y-4">
          <Label>Experience</Label>
        {fields.map((_, idx)=>(
        <div key={idx} className="flex gap-4 border p-4 rounded-xl">
        <Input placeholder="Company" {...register(`experiences.${idx}.company`)} />
        <Input placeholder="Years" {...register(`experiences.${idx}.years`)} />
        <Button type="button" variant="destructive" onClick={()=>remove(idx)}>Remove</Button>
        </div>
        ))}
        <Button type="button" onClick={()=>append({ company:'', years:'' })}>+ Add Experience</Button>
        </div>
        <div className="space-y-2 flex gap-4">
        {/* Age */}
        <div className="space-y-2 grow">
          <Label>Age</Label>
          <Input type="number" {...register("age")} />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        {/* DOB */}
        <div className="space-y-2 grow">
          <Label>Date of Birth</Label>
          <Input type="date" {...register("dob")} />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
        </div>
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label>Marital Status</Label>
          <Select onValueChange={v => setValue("maritalStatus", v)}>
            <SelectTrigger  className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
            </SelectContent>
          </Select>
          {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>}
        </div>

        {/* Category */}
        
        <div className="space-y-2">
          <Label>Category</Label>
          <RadioGroup className="flex gap-4 justify-around items-center" onValueChange={v => setValue("category", v)}>
            <div className="flex items-center space-x-2 border px-4 py-2 rounded-md">
              <RadioGroupItem value="job" id="job" />
              <Label htmlFor="job">Job</Label>
            </div>
            <div className="flex items-center space-x-2 border px-4 py-2 rounded-md">
              <RadioGroupItem value="feedback" id="feedback" />
              <Label htmlFor="feedback">Feedback</Label>
            </div>
          </RadioGroup>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Conditional JOB Fields */}
        {category === "job" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex grow gap-4 w-full">              
              <div className="space-y-2 grow">
                <Label>Salary Expectation</Label>
                <Input type="number" {...register("salary")} />
              </div>
              <div className="space-y-2 grow">
                <Label>Experience (years)</Label>
                <Input type="number" {...register("experience")} />
              </div>
            </div>
            <div className="flex items-center gap-4 ">
            <div className="flex flex-col gap-2 grow">
              <Label>Preferred Shift</Label>
              <Select onValueChange={v => setValue("preferredShift", v)}>
                <SelectTrigger className='w-full'><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch onCheckedChange={v => setValue("remote", v)} />
              <Label>Remote Allowed?</Label>
            </div>
            </div>
          </div>
        )}

        {/* Conditional FEEDBACK Fields */}
        {category === "feedback" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Feedback Type</Label>
              <Select onValueChange={v => setValue("feedbackType", v)}>
                <SelectTrigger className='w-full'><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select onValueChange={v => setValue("severity", v)}>
                <SelectTrigger className='w-full'><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Extra Info</Label>
              <Textarea {...register("extraInfo")} />
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <Textarea {...register("skills")} />
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
        </div>
        
        {/* Agreement */}
        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-100">
          <Switch onCheckedChange={v => setValue("agree", v)} />
          <Label>I agree to the terms</Label>
        {errors.agree && <p className="text-red-500 text-sm">{errors.agree.message}</p>}
        </div>

        <Button className="w-full">Submit</Button>
      </form>
    </div>
  );
}
