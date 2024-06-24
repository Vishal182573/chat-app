'use client';

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
const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Must be a valid email address." }),
    contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    photographUri: z.string(),
});

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
                alert("User registered successfully");
                router.push("/auth/signin");
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
        <section className="w-full h-screen flex justify-center items-center p-10">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition-all hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        <Input type="password" placeholder="Your password" {...field} className="text-gray-900" />
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
                                    <FormLabel>Photograph URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., http://example.com/photo.jpg" {...field} className="text-gray-900" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Register
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
