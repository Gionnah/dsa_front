"use client"
import HomeLayout from '@/components/layout/HomeLayout';
import { useEffect, useState } from 'react';

export default function LeaderBoard(){
    const [leaderBoardData, setLeaderBoardData] = useState<any>([]);

    const getLeaderBoard = async () => {
        const res = await fetch('/api/leader-board', {
            method: 'GET'
        });
        const data = await res.json();
        setLeaderBoardData(data);
    }

    useEffect(()=>{
        getLeaderBoard();
    }, []);

    return (
        <HomeLayout>
            <div>
                
            </div>
        </HomeLayout>
    )
}
