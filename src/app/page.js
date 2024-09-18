"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        const username = event.target.username.value; // Get the username value
        if (username) {
            router.push(`/${username}`); // Redirect to the new URL
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" id="username" />
                </label>
                <button type="submit">Go</button>
            </form>
        </div>
    );
}
