"use client"
import { useState } from 'react'

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
    }

    return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="/dsa_logo.png" alt="dsa logo" className="mx-auto h-20 w-auto" />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-100">Matricule</label>
                <div className="mt-2">
                <input id="username" value={username} onChange={changeUsername} type="text" name="username" required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 transition-all duration-200 focus:shadow-ls focus:shadow-blue-700 sm:text-sm/6" />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
                <div className="text-sm">
                    <a href="#" className="font-semibold text-blue-500 hover:text-blue-400">Forgot password?</a>
                </div>
                </div>
                <div className="mt-2">
                <input value={password} onChange={changePassword} id="password" type="password" name="password" required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 transition-all duration-200 focus:shadow-ls focus:shadow-blue-700 sm:text-sm/6" />
                </div>
            </div>

            <div>
                <button type="submit" className="flex w-full justify-center cursor-pointer rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-200 focus:shadow-ls focus:shadow-blue-700">Sign in</button>
            </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-400">
                Don't have an account?
            <a href="#" className="font-semibold text-blue-500 hover:text-blue-400"> Sign up</a>
            </p>
        </div>
        </div>
    </div>
  )
}
