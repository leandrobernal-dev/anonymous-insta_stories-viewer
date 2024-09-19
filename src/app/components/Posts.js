import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Posts({ storyCount, stories, posts }) {
    return (
        <div className="w-full max-w-3xl mx-auto   text-zinc-100">
            <Tabs
                defaultValue={storyCount > 0 ? "stories" : "posts"}
                className="w-full"
            >
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
                <TabsContent value="posts" className="mt-8">
                    <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <Card key={i} className="bg-zinc-800 border-none">
                                <CardContent className="p-0">
                                    <Image
                                        src={`/placeholder.svg?height=300&width=300&text=Post ${
                                            i + 1
                                        }`}
                                        alt={`Post ${i + 1}`}
                                        width={300}
                                        height={300}
                                        className="object-cover aspect-square"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="stories" className="mt-8">
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-600">
                                    <Image
                                        src={`/placeholder.svg?height=64&width=64&text=S${
                                            i + 1
                                        }`}
                                        alt={`Story ${i + 1}`}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                </div>
                                <span className="mt-2 text-sm text-zinc-400">
                                    Story {i + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
