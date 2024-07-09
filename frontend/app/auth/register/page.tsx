'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/global/constants";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaImage } from 'react-icons/fa';
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Must be a valid email address." }),
    contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    photographUri: z.instanceof(File).refine(file => file.size > 0, { message: "File is required" }).optional(),
});

export default function Register() {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      };
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            contactNumber: "",
            password: "",
            photographUri: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let photographUri = '';

            if (values.photographUri) {
                const formData = new FormData();
                formData.append('image', values.photographUri);

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
            }

            const registrationData = {
                ...values,
                photographUri,
            };

            const response = await axios.post(
                `${BACKEND_URL}/api/user/register`,
                registrationData
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
        <motion.div className="w-full min-h-screen flex justify-center items-center p-4 bg-white shadow-2xl" variants={itemVariants} initial="hidden" animate="visible">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {[
                                { name: "username", label: "Username", icon: <FaUser className="mr-2" />, placeholder: "e.g., johndoe" },
                                { name: "email", label: "Email", icon: <FaEnvelope className="mr-2" />, placeholder: "e.g., john.doe@example.com" },
                                { name: "contactNumber", label: "Contact Number", icon: <FaPhone className="mr-2" />, placeholder: "e.g., 1234567890" },
                                { name: "password", label: "Password", icon: <FaLock className="mr-2" />, placeholder: "Your password", type: "password" },
                            ].map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name as "username" | "email" | "contactNumber" | "password"}
                                    render={({ field: formField }) => (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    {field.icon}
                                                    <Input
                                                        placeholder={field.placeholder}
                                                        {...formField}
                                                        type={field.type || "text"}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <FormField
                                control={form.control}
                                name="photographUri"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photograph</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <FaImage className="mr-2" />
                                                <Input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const files = e.target?.files;
                                                        if (files && files.length > 0) {
                                                            field.onChange(files[0]);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Button variant="link" className="p-0" onClick={() => router.push("/auth/signin")}>
                            Sign In
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}