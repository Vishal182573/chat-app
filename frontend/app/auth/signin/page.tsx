// pages/api/auth/signin.tsx
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
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full h-screen flex justify-center items-center p-3 ">
      <div className="w-full h-full bg-slate-950 opacity-90 rounded-2xl flex justify-center p-8">
        <div className="space-y-4 w-[400px] flex flex-col justify-between shadow-xl p-8 rounded-3xl text-white border-2 border-white ">
          <h1 className="font-bold text-3xl text-center">Login</h1>
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
          <div>
          </div>
          <div className="text-center">
            <span className="">Don't have an account? </span>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-bold"
              onClick={() => router.push("/auth/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
