"use client";

import NotFound from "@/app/components/404Page";
import LoadingPosts from "@/app/components/LoadingPosts";
import Navbar from "@/app/components/Navbar";
import Posts from "@/app/components/Posts";
import PrivateAccountNotice from "@/app/components/PrivateAccountNotice";
import Profile from "@/app/components/Profile";
import ProfileSkeleton from "@/app/components/ProfileSkeleton";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const [isValidUsername, setIsValidUsername] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/${params.username}`).then((data) => {
            console.log(data.data);
            setIsLoading(false);

            if (data.data.valid === false) {
                setIsValidUsername(false);
            } else {
                setData(data.data);
            }
        });
    }, []);
    return (
        <main className="">
            <Navbar currentValue={params.username} />
            <div className="flex justify-center">
                {isValidUsername === false ? (
                    <NotFound />
                ) : (
                    <div className="w-[92%] max-w-4xl">
                        {!isLoading ? (
                            <Profile data={data} params={params} />
                        ) : (
                            <ProfileSkeleton />
                        )}

                        <Separator className="mt-8" />
                        {data?.isPrivate ? (
                            <PrivateAccountNotice />
                        ) : (
                            <>{isLoading ? <LoadingPosts /> : <Posts />}</>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
