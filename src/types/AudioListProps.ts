import type { AudioItemProps } from "../types/AudioItemProps";
export interface AudioListProps {
  audios: AudioItemProps[];
  onPlay: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}
