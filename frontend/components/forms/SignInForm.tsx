import { signIn } from 'next-auth/react';

interface SignInFormProps {
  provider: any;
}

const SignInForm = ({ provider }: SignInFormProps) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form as any).email.value;
    const password = (form as any).password.value;

    await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: '/', // Redirect to the home page after sign in
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="text"
            autoComplete="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </form>
      <div className="space-y-1 text-center mt-4">
        <p className="text-sm text-gray-500">Or Continue With</p>
      </div>
    </>
  );
};

export default SignInForm;
