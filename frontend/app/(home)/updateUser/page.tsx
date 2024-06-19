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
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/global/constants";
import { User } from "@/global/types";

// Define the schema using zod
const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).optional(),
    contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits." }).optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
    photographUri: z.string().optional(),
});

export default function UserUpdatePage() {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn(undefined, { callbackUrl: '/' });
        },
    });
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user as User);
        }
    }, [session]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: currentUser?.username || "",
            contactNumber: currentUser?.contactnumber || "",
            password: "",
            photographUri: currentUser?.photographUri || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Ensure the required username field is present
        if (!values.username) {
            alert("Username is required");
            return;
        }

        // Merge the current user details with the new values
        const updatedValues = {
            username: values.username || currentUser?.username,
            email: currentUser?.email, // Add email from session
            contactNumber: values.contactNumber || currentUser?.contactnumber,
            password: values.password,
            photographUri: values.photographUri || currentUser?.photographUri,
        };

        console.log(updatedValues);

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/user/updateUser`,
                updatedValues
            );

            if (response.status === 201) {
                alert("User details updated successfully");
                router.push("/");
                console.log("Success:", response.data);
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <section className="w-full h-screen flex justify-center items-center p-3">
            <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl flex justify-center p-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 flex flex-col p-10 rounded-2xl w-[500px] border-white border-[1px] text-sm font-bold text-white"
                    >
                        <div className="font-bold text-3xl text-center">Update Details</div>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="text-gray-900" />
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
                                        <Input {...field} className="text-gray-900" />
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
                                    <FormLabel>Set Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="text-gray-900" />
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
                                        <Input {...field} className="text-gray-900" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="bg-blue-500">Update</Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
