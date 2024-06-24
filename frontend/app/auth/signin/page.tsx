'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';
import { Button } from '../../../components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import SignInForm from '../../../components/forms/SignInForm';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/' }); // Redirect to the home page after sign in
  };

  if (!providers) {
    return <div className="flex justify-center items-center h-screen text-4xl">Loading...</div>;
  }

  return (
    <section className="w-full h-screen flex justify-center items-center p-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transform transition-all hover:scale-105">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h1>
        <div className="space-y-4">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="mt-4">
              {provider.name === "Credentials" ? (
                <SignInForm provider={provider} />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleSignIn(provider.id)}
                  className="flex items-center w-full justify-center p-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {provider.name === "GitHub" && <FaGithub className="mr-2 text-lg" />}
                  Sign in with {provider.name}
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 font-bold"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );
}
