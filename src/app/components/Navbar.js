"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        const username = event.target.username.value; // Get the username value
        if (username) {
            router.push(`/${username}`); // Redirect to the new URL
        }
    };
    return (
        <nav className=" py-8">
            <div className="container w-[92%] max-w-4xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white text-2xl font-bold">
                    LOGO
                </Link>
                <form className="relative" onSubmit={handleSubmit}>
                    <input
                        name="username"
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        className="bg-transparent text-white border-b border-white focus:outline-none focus:border-white pr-4 py-2"
                    />
                    <button>
                        <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                    </button>
                </form>
            </div>
        </nav>
    );
}
