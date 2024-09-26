import StoryModal from "@/app/components/Story";
import Image from "next/image";
import React, { useState } from "react";

export default function StoryThumbnails({ stories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openModal = (index) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedIndex(0);
        setIsModalOpen(false);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {stories.map((story, index) => (
                <div
                    key={index}
                    className="w-full aspect-[9/16] cursor-pointer "
                    onClick={() => openModal(index)}
                >
                    {story.type === "image" ? (
                        <Image
                            width={300}
                            height={300}
                            quality={100}
                            priority
                            src={story.url}
                            alt={`Story ${index + 1}`}
                            className="w-full h-full rounded-lg object-cover"
                        />
                    ) : (
                        <video
                            src={story.videoUrl.replace(
                                /&bytestart=\d+&byteend=\d+/,
                                ""
                            )}
                            className="w-full h-full rounded-lg object-cover"
                        />
                    )}
                </div>
            ))}
            {stories.length > 0 && (
                <StoryModal
                    stories={stories}
                    initialIndex={selectedIndex}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
