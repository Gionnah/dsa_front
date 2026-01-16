"use client";

import ContestDetailsPage from "@/components/ContestDetails";
import HomeLayout from "@/components/layout/HomeLayout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContestPage() {
    const [contestData, setContestData] = useState<any>([]);
    const { contestId } = useParams<{contestId: string}>();
    const [teamData, setTeamData] = useState<any>([])

    const getContestData = async () => {
        try {
            const response = await fetch(`/api/contests/${contestId}`); 
            const data = await response.json();
            setContestData(data);
            const dataTeam = await fetch(`/api/contests/${contestId}/teams/`)
            setTeamData(await dataTeam.json())
        } catch (error) {
            console.error("Error fetching contest data:", error);
        }
    };

    useEffect(() => {
        getContestData();
    }, [])

    return (
        <div>
            <HomeLayout>
                <div className="p-4 text-black">
                    <ContestDetailsPage contestData={contestData} teamData={teamData} />
                </div>
            </HomeLayout>
        </div>
    )
}
// /members/event/contest/[id]/page.tsx