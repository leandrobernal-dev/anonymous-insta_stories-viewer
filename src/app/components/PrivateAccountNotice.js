import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivateAccountNotice() {
    return (
        <div className="flex items-center justify-center my-12">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <div className="rounded-full bg-zinc-800 p-3">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                        This Account is Private
                    </h2>
                    <p className="text-center text-zinc-400">
                        Follow them on Instagram to see their photos and videos
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
