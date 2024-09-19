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
                                    quality={100}
                                    priority
                                    src={data.profilePic}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {params.username}{" "}
                                <span className="text-sm font-thin text-zinc-400">
                                    (Anonymous view)
                                </span>
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
