import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import LoadingPosts from "@/app/components/LoadingPosts";

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
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
                            {stories.map((item, i) => {
                                if (item.type === "video") {
                                    return (
                                        <div key={i} className="">
                                            <video
                                                src={item.videoUrl.replace(
                                                    /&bytestart=\d+&byteend=\d+/,
                                                    ""
                                                )}
                                                controls
                                            ></video>
                                            <audio
                                                src={item.audioUrl.replace(
                                                    /&bytestart=\d+&byteend=\d+/,
                                                    ""
                                                )}
                                                controls
                                            ></audio>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            key={i}
                                            className="w-full aspect-[9/16] overflow-hidden border-2 border-zinc-600"
                                        >
                                            <Image
                                                src={item.url}
                                                alt={`Story ${i + 1}`}
                                                priority
                                                quality={100}
                                                width={1080}
                                                height={1920}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="posts" className="mt-8"></TabsContent>
            </Tabs>
        </div>
    );
}
