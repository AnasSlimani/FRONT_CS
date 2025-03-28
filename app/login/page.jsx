"use client";
import {useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import api from "../api/axios";
import { useRouter } from "next/navigation";




const LoginForm = () => {

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const router = useRouter();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login",loginForm, {public : true});
      const token = response.data;
      console.log(token);
      localStorage.setItem("token",token);
      window.location.href = '/';
    } catch (error) {
      alert("User not found: " + error)
      throw error;
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  return (
    <div
    className="my-10 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
      Welcome to JAGUARS
    </h2>
    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
      Sign up to jaguars if you can because we don&apos;t have a login flow
      yet
    </p>
    <form className="my-8" onSubmit={handleSubmit}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" placeholder="projectmayhem@fc.com" type="email" name="email" value={loginForm.email} onChange={handleChange} />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="••••••••" type="password" name="password" value={loginForm.password} onChange={handleChange}/>
      </LabelInputContainer>
      

      <button
        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
        type="submit" >
        Log in &rarr;
        <BottomGradient />
        
      </button>

      <div
        className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
    </form>
  </div>
    
  )
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};


const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default LoginForm