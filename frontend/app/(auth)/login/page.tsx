"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useRouter } from "next/navigation";
import { Separator } from "../../../components/ui/separator"
import { FaGithub, FaGoogle } from 'react-icons/fa';
import axios from "axios"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("https://chat-app-1-5qqj.onrender.com/api/user/login", values);
      if (response.status == 201) {
        const { token } = response.data; // Assuming response.data contains the token
        localStorage.setItem('token', token); // Store token in localStorage
        alert("Login Succesfull")
        router.push('/');
      }
      else {
        throw new Error("Something Went wrong")
      }
    } catch (err: any) {
      console.log(err);
      alert(err.message)
    }
  }

  const handleSocialSignIn = (provider: "google" | "github") => {
    // signIn(provider, { callbackUrl: "/" });
  };

  return (
    <section className="w-full h-screen flex justify-center items-center p-3 text-white">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl p-8 flex justify-center">
        <div className="space-y-4 w-[400px] flex flex-col justify-center shadow-xl p-8 border border-white rounded-2xl">
          <h1 className="font-bold text-3xl text-center">Login</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        {...field}
                        className="text-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
              >
                Login
              </Button>
            </form>
          </Form>
          <div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">
                Or Continue With
              </p>
            </div>
            <Separator />
          </div>

          <div className="text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-bold"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button
              type="button"
              className="rounded-full "
              variant={"destructive"}
              onClick={() => handleSocialSignIn("google")}
            >
              <FaGoogle className="2rem" />
            </Button>
            <Button
              type="button"
              className="rounded-full bg-[#3d5a77] hover:bg-[#1a1e21] text-white"
              onClick={() => handleSocialSignIn("github")}
            >
              <FaGithub className="2rem" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


