import HomeLayout from '@/components/layout/HomeLayout'
import Link from 'next/link'

export default function OneChallenge() {
    return (
        <div>
            <HomeLayout>
                <div className="w-full px-4 bg-linear-to-b from-blue-950 to-cyan-900 rounded-lg shadow-2xl">
                    <section className="relative flex  rounded-sm px-8 mb-4 overflow-hidden animate-slide-in">
                        <div className="absolute inset-0"></div>
                        <div className="relative w-4/5 z-10 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border-4 border-white border-opacity-30">
                                    <div className="text-4xl font-bold text-white">
                                        <div className="flex gap-1">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                                </svg>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                                </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Palindrome Detector</h3>
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
                        </div>

                        <div className="relative w-1/5 h-44">
                            <div className="absolute top-0 right-0 w-full h-full">
                                <img className="h-full w-full object-cover object-center" src="/golden_challenge.png" alt=""/>
                            </div>
                        </div>
                    </section>
                    <Link href={`/editor/sessioId`}>
                        <button className='mb-4 hover:scale-105 transition-all ease-in-out duration-300 border-4 border-green-300/10 bg-green-700/10 cursor-pointer text-green-400 font-semibold hover:bg-green-900/10 border-double px-4 py-2 rounded-lg'>Go to code :D</button>
                    </Link>
                </div>
            </HomeLayout>
        </div>
  )
}
