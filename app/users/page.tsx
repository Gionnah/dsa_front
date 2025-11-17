import HomeLayout from '@/components/layout/HomeLayout'
import UsersPage from '@/components/Users'
import React from 'react'

export default function Users() {
  return (
    <div>
        <HomeLayout>
            <div className="m-4 bg-white shadow-2xl rounded-lg">
                <UsersPage />
            </div>
        </HomeLayout>
    </div>
  )
}
