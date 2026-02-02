import ChallengesPage from '@/components/Challenge'
import HomeLayout from '@/components/layout/HomeLayout'
import React from 'react'

export default function Challenges() {
  return (
    <div>
        <HomeLayout>
            <div className="m-4">
                <ChallengesPage />
            </div>
        </HomeLayout>
    </div>
  )
}
