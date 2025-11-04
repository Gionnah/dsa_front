import HomeLayout from '@/components/layout/HomeLayout'
import UsersPage from '@/components/Users'
import React from 'react'

export default function Users() {
  return (
    <div>
        <HomeLayout>
            <div className="m-2 bg-neutral-800 shadow-2xl rounded">
                <UsersPage />
            </div>
        </HomeLayout>
    </div>
  )
}
