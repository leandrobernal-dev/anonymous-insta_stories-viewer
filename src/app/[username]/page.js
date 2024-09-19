"use client";

import Navbar from "@/app/components/Navbar";
import PrivateAccountNotice from "@/app/components/PrivateAccountNotice";
import Profile from "@/app/components/Profile";
import ProfileSkeleton from "@/app/components/ProfileSkeleton";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/${params.username}`).then((data) => {
            setIsLoading(false);
            setData(data.data);
        });
    }, []);
    return (
        <main className="">
            <Navbar />
            <div className="flex justify-center">
                <div className="w-[92%] max-w-4xl">
                    {isLoading ? (
                        <ProfileSkeleton />
                    ) : (
                        <Profile data={data} params={params} />
                    )}

                    <Separator className="my-8" />
                    {data?.isPrivate ? <PrivateAccountNotice /> : null}
                </div>
            </div>
        </main>
    );
}
