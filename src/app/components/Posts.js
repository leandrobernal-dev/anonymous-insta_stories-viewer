import LoadingPosts from "@/app/components/LoadingPosts";
import StoryThumbnails from "@/app/components/StoryThumbnails";

export default function Posts({ stories, isLoadingStories }) {
    return (
        <div className=" mb-8 text-zinc-100">
            {isLoadingStories ? (
                <LoadingPosts />
            ) : stories.length === 0 ? (
                <p className="text-center text-lg text-zinc-500 dark:text-zinc-400">
                    No stories available
                </p>
            ) : (
                <StoryThumbnails stories={stories} />
            )}
        </div>
    );
}
