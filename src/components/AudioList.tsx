import type { FC } from "react";
import AudioCard from "./common/AudioCard";
// import type { AudioItemProps } from "../types/AudioItemProps";
import type { AudioListProps } from "../types/AudioListProps";

const AudioList: FC<AudioListProps> = ({
  audios,
  onPlay,
  onDownload,
  onDelete,
}) => {
  return (
    <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-2 audio-scroll">
      {audios.map((audio) => (
        <AudioCard
          key={audio.id}
          audio={audio}
          onPlay={onPlay}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AudioList;
