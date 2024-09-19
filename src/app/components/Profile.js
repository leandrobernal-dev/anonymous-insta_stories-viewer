import Image from "next/image";

export default function Profile({ data, params }) {
    return (
        <div className="mt-4">
            {data && (
                <header className="sm:flex gap-8">
                    <div className="flex justify-center">
                        <div className="w-52 relative h-52 aspect-square p-1 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={data.profilePic}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {Number(data.storyCount) === 0 ? null : (
                                <div className="absolute bottom-6 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-white text-sm font-black">
                                        {data.storyCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {params.username}
                            </h1>
                        </div>
                        <div className="flex gap-2 mt-2">
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
                        <br />
                        <span className="flex gap-2 items-center ">
                            <h1 className="font-bold">{data.name} </h1>
                            <span className="text-sm font-thin text-zinc-400">
                                {data.pronoun}
                            </span>
                        </span>
                        <br />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data.descriptionHtml,
                            }}
                        ></div>
                    </div>
                </header>
            )}
        </div>
    );
}