import React, { forwardRef } from "react";
import { motion as Motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const VideoPlayerSection = forwardRef(({ currentLesson, handleVideoEnd }, ref) => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black w-full aspect-video relative group overflow-hidden"
    >
      {currentLesson?.videoUrl ? (
        <video
          ref={ref}
          src={currentLesson.videoUrl}
          controls
          onEnded={handleVideoEnd}
          className="w-full h-full object-contain"
          controlsList="nodownload"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>

          <p className="text-gray-400 font-medium">
            No video available for this lesson
          </p>

          <p className="text-gray-600 text-sm mt-2">
            Content coming soon
          </p>
        </div>
      )}
    </Motion.div>
  );
});

VideoPlayerSection.displayName = "VideoPlayerSection";

export default VideoPlayerSection;