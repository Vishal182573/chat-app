"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import axios from "axios";
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
import { BACKEND_URL } from "@/global/constants";

// Define the schema using zod
const formSchema = z
    .object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        email: z.string().email({
            message: "Must be a valid email address.",
        }),
        contactNumber: z.string().min(10, {
            message: "Contact number must be at least 10 digits.",
        }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
        photographUri: z.string(),
    })

export default function Register() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            contactNumber: "",
            password: "",
            photographUri: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/user/register`,
                values
            );

            if (response.status === 201) {
                alert("User registered succesfully")
                router.push("/login");
                console.log("Success:", response.data);
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    return (
        <section className="w-full h-screen flex justify-center items-center p-3 ">
            <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl flex justify-center p-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3 flex flex-col justify-start px-10 rounded-2xl w-[500px] border-white border-[1px] text-sm font-bold text-white"
                    >
                        <div className="font-bold text-3xl text-center">Register</div>


                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., johndoe" {...field} className="text-gray-900" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., john.doe@example.com" {...field} className="text-gray-900" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 1234567890" {...field} className="text-gray-900" />
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
                                        <Input type="password" {...field} className="text-gray-900" placeholder="vishal@123" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="photographUri"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Photograph</FormLabel>
                                    <FormControl>
                                        <Input type="photographUri" {...field} className="text-gray-900"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-blue-500">Register</Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
