"use client";

import HomeLayout from "@/components/layout/HomeLayout";

export default function Dashboard() {
  return (
    <div className="">
        <HomeLayout>
            <div className="p-2 bg-neutral-800 rounded-lg shadow-2xl">
                <section className="relative bg-blue-950 rounded-sm p-8 mb-4 overflow-hidden animate-slide-in">
                    <div className="absolute inset-0"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border-4 border-white border-opacity-30">
                                <span className="text-4xl font-bold text-white">VM</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2">Velonjanahary Maherilaza Giovanni Jonah</h3>
                                <p className="text-white text-opacity-90 text-lg mb-1">
                                    Member
                                </p>
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white">
                                    Grade Alpha
                                    </span>
                                    <span className="text-white text-opacity-80">•</span>
                                    <span className="text-white text-opacity-90">150 XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="relative">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(255,255,255,0.5)"
                                    strokeWidth="8"
                                    fill="none"
                                    />
                                    <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(255,255,255,0.4)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray="351.86"
                                    strokeDashoffset="87.96"
                                    className="progress-ring"
                                    strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white/70">75</span>
                                    <span className="text-xs text-white/70">
                                    Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1/4 bg-blue-950">
                        <svg className="block absolute left-0 inset-y-0 h-full w-8 text-blue-950"
                            fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="0,0 100,0 0,100 0,100"></polygon>
                        </svg>
                        <img className="h-full w-full object-cover object-top" src="/profil.jpg" alt=""/>
                    </div>
                </section>

                <div className="">
                    <div className="w-full flex gap-7">
                        <div className="left w-3/5">
                            <div className="w-full border-4 border-double border-teal-700 rounded-lg text-white">
                                <div className=" bg-teal-700 px-6 py-3">
                                    <div className="flex justify-between">
                                        <div className="">
                                            {/* <h1 className="font-semibold">Velonjanahary Maherilaza Giovanni jonah</h1> */}
                                            <p className="text-sm text-neutral-300 mt-2">Matricule : 90/LA/24-25</p>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <p className="px-3 py-1 bg-blue-300/15">Grade : Beta</p>
                                            <p className="px-3 py-1 bg-blue-300/15">L3 IAD</p>
                                        </div>
                                    </div>
                                    <div className="py-3">
                                        <div className="bg-black/30 w-full rounded-md py-2 px-3">
                                            {/* <h2 className="text-sm text-neutral-400">Last challenge</h2> */}
                                            <div className="flex justify-between items-center gap-3 my-1">
                                                <div className="">
                                                    <p className="font-semibold ">Challenge Name</p>
                                                </div>
                                                <button className="bg-green-700 py-2 px-6 text-white rounded-lg text-sm">Go to challenge</button>
                                            </div>
                                            <div className="w-full flex justify-between mb-2 text-sm font-semibold text-neutral-400">
                                                    <p>in progress</p>
                                                    <p className="">75%</p>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                                            </div>
                                            <div className="flex gap-3 items-center mt-2 text-sm">
                                                <p className="px-3 py-1 bg-blue-300/15">Last level : 1</p>
                                                <p className="px-3 py-1 bg-blue-300/15">current level : 1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right w-2/5">
                            <div className="w-full bg-blue-900 text-white">
                                <div className="name">
                                </div>
                            </div>
                            <div className="w-full bg-neutral-800 rounded">
                                <div className="w-full bg-amber-500 rounded-t text-white font-semibold px-6 py-3 text-center">
                                    Achievement
                                </div>
                                <div className="px-6 py-4">
                                    Project 1
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    </div>
  );
}

