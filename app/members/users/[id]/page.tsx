"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GetUserPage() {
    const { id } = useParams<{id: string}>();
    const [userData, setUserData] = useState<any>([]);

    const getUserData = async () => {
        const response = await fetch(`/api/users/${id}`,
            {
                method: 'GET'
            }
        );
        const data = await response.json()
        setUserData(data);
    }

    useEffect(()=> {
        getUserData();
    }, [])

    return (
        <div>

        </div>
  )
}
