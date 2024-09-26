"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Home() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        setIsSubmitted(true);
        const username = event.target.username.value; // Get the username value
        if (username) {
            router.push(`/${username}`); // Redirect to the new URL
        }
    };
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <InstagramLogoIcon className="w-16 h-16 text-white mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Anonymous Insta Stories Viewer
                    </h1>
                    <p className="text-zinc-400">
                        View Instagram stories privately without logging in
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            required
                            placeholder="Enter Instagram username"
                            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-white focus:ring-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-zinc-200 transition-colors"
                    >
                        {isSubmitted && (
                            <svg
                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                        View Stories
                    </Button>
                </form>
                <p className="text-zinc-500 text-sm text-center mt-8">
                    This tool is for educational purposes only. Please respect
                    Instagram's terms of service and users' privacy.
                </p>
            </div>
        </div>
    );
}
