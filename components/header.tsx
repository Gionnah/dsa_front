"use client"
import { CalendarDays, Home, LogOut, Trophy, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const navItems = [
  { link: "/members/home", label: "Home", icon: <Home className='w-5 h-5'/> },
  { link: "/members/users", label: "Users", icon: <UserRound className='w-5 h-5'/> },
  { link: "/members/challenges", label: "Challenges", icon: <Trophy className='w-5 h-5'/>},
  { link: "/members/event", label: "Event", icon: <CalendarDays className='w-5 h-5'/> },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div>
      
      {/* NAV */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-black ${
          isScrolled 
            ? 'bg-black/20 backdrop-blur-lg shadow-lg mx-4 mt-4 rounded-2xl' 
            : 'bg-gray-50'
        }`}>
        <nav className={`min-h-10 z-10`}>
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
                <Image src={'/dsa_logo.png'} alt='dsa logo' width={100} height={70}/>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((n) => (
                <Link href={n.link}
                  key={n.link}
                  className={`text-sm px-3 py-2 rounded-lg transition font-medium flex items-center gap-2 hover:text-blue-900`}
                >
                  {n.label}
                  { n.icon }
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">              
              <button className={`hidden cursor-target cursor-pointer md:flex items-center gap-2 border border-neutral-400 text-sm px-4 py-2 hover:bg-neutral-100 hover:shadow transition-all ease-in-out duration-200`}>
                Sign out <LogOut className='w-4 h-4' />
              </button>

              <div className="md:hidden">
                <button onClick={() => document.getElementById("nav-mobile")?.classList.toggle("!translate-y-0")} className={`p-2 rounded-md 
                    `}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M3 12h18M3 18h18" 
                    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div id="nav-mobile" className={`md:hidden translate-y-[-200%] transition-transform duration-300 origin-top border-t`}>
            <div className="px-4 pb-4 flex flex-col gap-2">
              {navItems.map((n) => (
                <Link href={n.link} 
                  key={n.link} 
                  className={`text-left px-3 py-2 rounded-lg ${"hover:bg-blue-50 text-blue-900"}`}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </nav> 
      </header>
    </div>
  )
}
