import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingPosts from "@/app/components/LoadingPosts";
import StoryThumbnails from "@/app/components/StoryThumbnails";

export default function Posts({ stories, posts, isLoadingStories }) {
    return (
        <div className="w-full max-w-3xl mx-auto   text-zinc-100">
            <Tabs defaultValue="stories" className="w-full">
                <TabsList className="grid w-full grid-cols-2 justify-center p-0 bg-transparent">
                    <TabsTrigger
                        value="stories"
                        className="data-[state=active]:border-t-4 hover:text-white rounded-none p-4  data-[state=active]:text-white "
                    >
                        Stories
                    </TabsTrigger>
                    <TabsTrigger
                        value="posts"
                        className="data-[state=active]:border-t-4 hover:text-white rounded-none p-4 data-[state=active]:text-white "
                    >
                        Posts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="stories" className="mt-8">
                    {isLoadingStories ? (
                        <LoadingPosts />
                    ) : stories.length === 0 ? (
                        <p className="text-center text-lg text-zinc-500 dark:text-zinc-400">
                            No stories available
                        </p>
                    ) : (
                        <StoryThumbnails stories={stories} />
                    )}
                </TabsContent>
                <TabsContent value="posts" className="mt-8"></TabsContent>
            </Tabs>
        </div>
    );
}
