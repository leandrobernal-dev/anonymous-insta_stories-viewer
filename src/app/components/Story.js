import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";

export default function StoryModal({ stories, initialIndex, isOpen, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const currentStory = stories[currentIndex];

    useEffect(() => {
        if (
            isOpen &&
            (currentStory.type === "video" ||
                currentStory.type === "mute-video")
        ) {
            videoRef.current?.play();
            if (currentStory.type === "video") {
                audioRef.current?.play();
            }
        }
    }, [isOpen, currentIndex, currentStory.type]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsPlaying(true);
        } else {
            onClose();
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current?.pause();
            audioRef.current?.pause();
        } else {
            videoRef.current?.play();
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle className="sr-only">Story</DialogTitle>
            <DialogContent className="p-0 bg-black max-w-sm w-full border-none aspect-[9/16] flex items-center justify-center">
                {currentStory.type === "image" && (
                    <Image
                        width={300}
                        height={300}
                        quality={100}
                        priority
                        src={currentStory.url}
                        alt="Story"
                        className="w-full h-full object-cover rounded-lg"
                    />
                )}
                {(currentStory.type === "video" ||
                    currentStory.type === "mute-video") && (
                    <>
                        <video
                            ref={videoRef}
                            src={currentStory.videoUrl.replace(
                                /&bytestart=\d+&byteend=\d+/,
                                ""
                            )}
                            className="w-full h-full object-cover rounded-lg"
                            playsInline
                            muted={currentStory.type === "mute-video"}
                            loop
                        />
                        {currentStory.type === "video" && (
                            <audio
                                ref={audioRef}
                                src={currentStory.audioUrl.replace(
                                    /&bytestart=\d+&byteend=\d+/,
                                    ""
                                )}
                                loop
                            />
                        )}
                    </>
                )}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="text-white hover:bg-zinc-800/50"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="text-white hover:bg-zinc-800/50"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </div>
                {(currentStory.type === "video" ||
                    currentStory.type === "mute-video") && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white hover:bg-zinc-800/50"
                    >
                        {isPlaying ? (
                            <Pause className="h-8 w-8" />
                        ) : (
                            <Play className="h-8 w-8" />
                        )}
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
}
