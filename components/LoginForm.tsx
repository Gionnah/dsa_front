"use client"
import { useState } from 'react'

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        setLoading(false);
        if (response.ok) window.location.href = '/home';
    }

    const style_input = 'block w-full min-w-xs rounded-md bg-white/80 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-black/10 placeholder:text-black/30 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 transition-all duration-200 focus:shadow-ls focus:shadow-blue-700 sm:text-sm/6';

    return (
    <div>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="/dsa_logo.png" alt="dsa logo" className="mx-auto h-20 w-auto" />
            </div>
            <div className='bg-white rounded-2xl mt-6 shadow-2xl mx-auto px-8 py-6'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-md font-bold tracking-tight text-blue-950">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-800">Matricule</label>
                        <div className="mt-2">
                            <input id="username" value={username} onChange={changeUsername} type="text" name="username" required className={`${style_input}`} />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-800">Password</label>
                            <div className="text-sm">
                                {/* <a href="#" className="font-semibold text-blue-500 hover:text-blue-400">Forgot password?</a> */}
                            </div>
                        </div>
                        <div className="mt-2">
                            <input value={password} onChange={changePassword} id="password" type="password" name="password" required autoComplete="current-password" className={`${style_input}`} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className={`flex w-full justify-center cursor-pointer rounded-md ${loading ? "bg-indigo-500" : "bg-blue-500"} px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-200 focus:shadow-ls focus:shadow-blue-700`}>{loading ? "loading..":"Sign in"}</button>
                    </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-800">
                        Don't have an account?
                    <a href="#" className="font-semibold text-blue-500 hover:text-blue-400"> Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}
