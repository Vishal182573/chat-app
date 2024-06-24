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
    photographUri: z.instanceof(File).refine(file => file.size > 0, { message: "File is required" }).optional(),
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
            photographUri: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {

        let photographUri = currentUser?.photographUri || "";

        if (values.photographUri) {
            const formData = new FormData();
            formData.append('image', values.photographUri);

            try {
                const uploadResponse = await axios.post(
                    `${BACKEND_URL}/api/image/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (uploadResponse.status === 201) {
                    photographUri = uploadResponse.data.imageUrl;
                } else {
                    throw new Error("Image upload failed");
                }
            } catch (error: any) {
                console.error("Image upload error:", error);
                alert(error.message);
                return;
            }
        }
        const updatedValues = {
            username: values.username || currentUser?.username,
            email: currentUser?.email, // Add email from session
            contactNumber: values.contactNumber || currentUser?.contactnumber,
            password: values.password,
            photographUri,
        };

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
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <section className="w-full h-screen flex justify-center items-center p-10">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition-all hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Update Your Details</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    <FormLabel>Password</FormLabel>
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
                                    <FormLabel>Photograph</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            onChange={(e) => {
                                                const files = e.target?.files;
                                                if (files && files.length > 0) {
                                                    field.onChange(files[0]);
                                                }
                                            }}
                                            className="text-gray-900"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Update
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}
