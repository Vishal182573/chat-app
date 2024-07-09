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
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaPhone, FaLock, FaCamera } from 'react-icons/fa';

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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user as User);
            if (session.user.image) {
                setPreviewImage(session.user.image);
            }
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
        setIsSubmitting(true);
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
                setIsSubmitting(false);
                return;
            }
        }
        const updatedValues = {
            username: values.username || currentUser?.username,
            email: currentUser?.email,
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
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue("photographUri", file);
        }
    };

    if (!currentUser) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <section className="w-full min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Update Your Details</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center"><FaUser className="mr-2" /> Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="text-gray-900" placeholder="Enter your username" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center"><FaPhone className="mr-2" /> Contact Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="text-gray-900" placeholder="Enter your contact number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center"><FaLock className="mr-2" /> Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} className="text-gray-900" placeholder="Enter new password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="photographUri"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center"><FaCamera className="mr-2" /> Photograph</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col items-center">
                                                    <Input
                                                        type="file"
                                                        onChange={handleImageChange}
                                                        className="text-gray-900 mb-2"
                                                    />
                                                    {previewImage && (
                                                        <motion.img
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="w-32 h-32 object-cover rounded-full mb-2 border-2 border-blue-500"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update"}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </section>
    );
}