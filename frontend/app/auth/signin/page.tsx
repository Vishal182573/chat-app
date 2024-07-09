'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import SignInForm from '../../../components/forms/SignInForm';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
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
    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    const handleSignIn = (providerId: string) => {
        signIn(providerId, { callbackUrl: '/' });
    };

    if (!providers) {
        return <div className="flex justify-center items-center h-screen text-4xl">Loading...</div>;
    }

    return (
        <motion.div className="w-full min-h-screen flex justify-center items-center p-4 bg-white" variants={itemVariants} initial="hidden" animate="visible">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            {provider.name === "Credentials" ? (
                                <SignInForm provider={provider} />
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => handleSignIn(provider.id)}
                                    className="w-full"
                                >
                                    {provider.name === "GitHub" && <FaGithub className="mr-2" />}
                                    {provider.name === "Google" && <FaGoogle className="mr-2" />}
                                    Sign in with {provider.name}
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Button variant="link" className="p-0" onClick={() => router.push("/auth/register")}>
                            Register
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}