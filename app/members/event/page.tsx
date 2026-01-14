'use client'
import HomeLayout from '@/components/layout/HomeLayout'
import React, { useEffect, useState } from 'react'
import EventComponent from '@/components/eventComponent'

export default function Event() {
  const [contests, setContests] = useState<any[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await fetch('/api/contests');
      const data = await response.json();
      setContests(data);
    };

    fetchContests();
  }, []);

  return (
    <div>
        <HomeLayout>
          <div className=''>
            <EventComponent events={contests} />
          </div>
        </HomeLayout>
    </div>
  )
}

