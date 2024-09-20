export async function generateMetadata({ params }) {
    const username = params.username;

    return {
        title: username + "'s Instagram Stories",
        description: "View Instagram stories anonymously.",
    };
}

export default function ProfilePageLayout({ children }) {
    return children;
}
