import type { FC } from "react";
import type { AudioItemProps } from "../../types/AudioItemProps";
import { Play, Download, Trash2 } from "lucide-react";

interface AudioCardProps {
  audio: AudioItemProps;
  onPlay: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const AudioCard: FC<AudioCardProps> = ({
  audio,
  onPlay,
  onDownload,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between bg-[#040D3C] rounded-xl shadow-md overflow-hidden w-full">
      {/* Play Button at the left edge */}
      <button
        onClick={() => onPlay(audio.id)}
        className="flex items-center justify-center bg-[#F97316] text-white w-18 h-18 flex-shrink-0"
      >
        <Play size={20} className="fill-current text-white" />
      </button>

      {/* Middle Content */}
      <div className="flex flex-col flex-1 mx-4 text-white truncate">
        <span className="font-medium truncate tracking-wider">
          {audio.title}
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
          <span className="text-[#F97316]">{audio.duration}</span>
          <span className="text-[#F97316]">{audio.date}</span>
        </div>
      </div>

      {/* Action Buttons at the right edge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDownload(audio.id)}
          className="flex items-center justify-center bg-[#F97316] w-18 h-18 text-white hover:opacity-90 transition"
        >
          <Download size={20} />
        </button>
        <button
          onClick={() => onDelete(audio.id)}
          className="flex items-center justify-center bg-[#6C2BD9] w-18 h-18 text-white hover:opacity-90 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AudioCard;
