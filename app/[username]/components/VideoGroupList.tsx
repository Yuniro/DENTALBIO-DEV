'use client'
import React, { useEffect, useState } from "react";
import VideoList from "./VideoList";

type VideoListProps = {
  userId: string;
}

const VideoGroupList: React.FC<VideoListProps> = ({
  userId,
}) => {
  const [videoGroups, setVideoGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    const fetchVideoGroups = async () => {
      const query = [
        userId ? `userId=${userId}` : '', // Add userId if it exists
        'type=videos'
      ]
        .filter(Boolean)                  // Remove empty strings
        .join('&');                       // Join with '&' to form a valid query string

      const response = await fetch(`/api/groups?${query}`, {
        method: 'GET'
      });
      const data = await response.json();

      setVideoGroups(data);
    };

    fetchVideoGroups();
  }, []);

  return (
    <div className="text-center mb-4" id="video">
      {(videoGroups.length > 0) &&
        <>
          {videoGroups.map((group, index) => (
            <VideoList
              key={group.id}
              groupname={group.name!}
              fetchedVideos={group.datas!}
            />
          ))}
        </>}
    </div>
  )
}

export default VideoGroupList;