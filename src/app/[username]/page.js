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
    const [isLoadingStories, setIsLoadingStories] = useState(true);

    const [stringData, setStringData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [stories, setStories] = useState([]);

    // Get scraped data
    useEffect(() => {
        axios.get(`/api/${params.username}`).then((data) => {
            setIsLoading(false);

            if (data.data.valid === false) {
                setIsValidUsername(false);
            } else {
                setStringData(data.data.mainEl);
            }
        });
    }, []);

    // Parse the string data
    useEffect(() => {
        if (stringData === null) return;

        // Dynamically insert the header HTML and query within it
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = stringData;
        console.log(tempDiv);

        const isPrivate = !![...tempDiv.querySelectorAll("span")].find((span) =>
            span.textContent.includes("This account is private")
        );

        const profilePicElement = tempDiv.querySelector("header img");
        const profilePic = profilePicElement ? profilePicElement.src : "";
        // Check if the profile picture's parent element is an anchor tag | anchor tag means no story available
        const hasStory = profilePicElement?.parentElement.tagName === "SPAN";

        const name =
            tempDiv.querySelector(
                "header > section > div > div:first-child > span:first-child"
            )?.textContent || "";

        const pronoun =
            tempDiv.querySelector(
                "header > section > div > div:first-child > span:nth-child(2)"
            )?.textContent || "";

        const description = tempDiv.querySelector(
            "header > section > div > span > div"
        );
        const descriptionHtml = description ? description.innerHTML : "";

        const posts =
            tempDiv.querySelector(
                "header > section > ul > li:nth-child(1) > div > span > span"
            )?.textContent || "";

        const followers =
            tempDiv.querySelector(
                "header > section > ul > li:nth-child(2) > div > a > span > span"
            )?.textContent || "";

        const following =
            tempDiv.querySelector(
                "header > section > ul > li:nth-child(3) > div > a > span > span"
            )?.textContent || "";

        setProfileData({
            name,
            profilePic,
            pronoun,
            descriptionHtml,
            posts,
            followers,
            following,
            hasStory,
            isPrivate,
        });
    }, [stringData]);

    useEffect(() => {
        if (profileData === null || profileData.isPrivate) return;

        axios.get(`/api/${params.username}/stories`).then((data) => {
            console.log(data.data);

            setIsLoadingStories(false);
            setStories(data.data);
        });
    }, [profileData]);

    return (
        <main className="">
            <Navbar currentValue={params.username} />
            <div className="flex justify-center">
                {isValidUsername === false ? (
                    <NotFound />
                ) : (
                    <div className="w-[92%] max-w-4xl">
                        {!isLoading ? (
                            <Profile data={profileData} params={params} />
                        ) : (
                            <ProfileSkeleton />
                        )}

                        <Separator className="mt-8" />
                        {profileData?.isPrivate ? (
                            <PrivateAccountNotice />
                        ) : (
                            <Posts
                                stories={stories}
                                isLoadingStories={isLoadingStories}
                            />
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
