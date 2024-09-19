import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="mt-4">
            <header className="sm:flex gap-8">
                <div className="flex justify-center">
                    <div>
                        <div className="w-52 h-52 relative rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 p-1">
                            <Skeleton className="w-full h-full rounded-full bg-white" />
                            <div className="absolute bottom-6 right-4 w-8 h-8 bg-red-500  rounded-full flex items-center justify-center border-2 border-white">
                                <Skeleton className="w-4 h-4 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 sm:mt-0 flex-1">
                    <div>
                        <Skeleton className="h-9 w-48 mb-4 bg-zinc-600" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-5 w-20 bg-zinc-600" />
                        <Skeleton className="h-5 w-24 bg-zinc-600" />
                        <Skeleton className="h-5 w-24 bg-zinc-600" />
                    </div>
                    <div className="mt-6">
                        <Skeleton className="h-5 w-32 mb-2 bg-zinc-600" />
                        <Skeleton className="h-4 w-24 bg-zinc-600" />
                    </div>
                    <div className="mt-4">
                        <Skeleton className="h-4 w-full max-w-md bg-zinc-600" />
                        <Skeleton className="h-4 w-full max-w-md mt-2 bg-zinc-600" />
                        <Skeleton className="h-4 w-3/4 max-w-md mt-2 bg-zinc-600" />
                    </div>
                </div>
            </header>
        </div>
    );
}
