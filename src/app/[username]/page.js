"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/${params.username}`).then((data) => {
            setData(data.data);
        });
    }, []);
    return (
        <main>
            <div className="flex w-full justify-center">
                {data && (
                    <div className="flex gap-8">
                        <div className="w-64 relative h-64 aspect-square p-1 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={data.profilePic}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {data.storyCount && (
                                <div className="absolute bottom-6 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-white text-sm font-bold">
                                        {data.storyCount}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-8">
                            <div className="flex gap-2">
                                <span>
                                    <strong>{data.posts}</strong> posts
                                </span>
                                <span>
                                    <strong>{data.followers}</strong> followers
                                </span>
                                <span>
                                    <strong>{data.following}</strong> following
                                </span>
                            </div>
                            <h1>
                                {data.name} <span>{data.pronoun}</span>
                            </h1>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data.descriptionHtml,
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
