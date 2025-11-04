"use client";
import { Bell, CalendarDays, Home, LogOut, Trophy, UserRound } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function HomeLayout({children}: any) {
  return (
    <div className="flex h-screen bg-neutral-900 text-gray-100">
      <aside className="w-15 bg-neutral-800/7 border-r border-neutral-700 flex flex-col items-center py-6">
        <div className="mb-8">
        
        </div>

        <nav className="flex-1 flex flex-col space-y-2 w-full px-2">
          {[
            { link: "home", label: "Home", icon: <Home className='w-5 h-5'/> },
            { link: "users", label: "Users", icon: <UserRound className='w-5 h-5'/> },
            { link: "challenges", label: "Challenges", icon: <Trophy className='w-5 h-5'/>},
            { link: "event", label: "Event", icon: <CalendarDays className='w-5 h-5'/> },
          ].map((item, i) => (
            <div key={i} className="nav-item relative group">
              <Link
                href={`${item.link}`}
                className={`flex items-center justify-center w-full h-12 rounded-xl ${
                  i === 0
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "text-gray-400 hover:bg-neutral-700 hover:text-white"
                } transition`}
              >
                {item.icon}
              </Link>
              <div className="z-50 tooltip absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-700"></div>
              </div>
            </div>
          ))}
        </nav>

        <div className="nav-item relative group">
          <button className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition">
            VM
          </button>
          <div className="tooltip absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
            Giovanni Jonah
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-700"></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-neutral-900">
        <header className="bg-neutral-800 border-b border-neutral-700">
          <div className="flex items-center justify-between px-8 py-2">
            <div>     
                <div className="flex items-center gap-4">
                    <Image src={'/dsa_logo.png'} alt='dsa logo' width={70} height={40}/>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative text-gray-400 hover:text-white transition">
                    <Bell className='cursor-pointer'/>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-teal-500 rounded-full"></span>
                </button>
                <button className={`cursor-pointe text-gray-400`}>
                    <LogOut className='w-4 h-4' />
                </button>
            </div>
          </div>
        </header>

        <div className="p-3">
          {children}
        </div>
      </main>
    </div>
  );
}
