import ChallengesPage from '@/components/Challenge'
import HomeLayout from '@/components/layout/HomeLayout'
import React from 'react'

export default function Challenges() {
  return (
    <div>
        <HomeLayout>
            <div className="m-2 bg-neutral-800 shadow-2xl rounded">
                <ChallengesPage />
            </div>
        </HomeLayout>
    </div>
  )
}
