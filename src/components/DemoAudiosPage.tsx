import { useState } from "react";
import AudioList from "../components/AudioList";
import type { AudioItemProps } from "../types/AudioItemProps";

const mockAudios: AudioItemProps[] = [
  {
    id: "1",
    title: "Loose weight and gain muscles",
    duration: "5 mins 30 secs",
    date: "22 July, 2025",
  },
  {
    id: "2",
    title: "Loose weight and gain muscles",
    duration: "4 mins 10 secs",
    date: "20 July, 2025",
  },
  {
    id: "3",
    title: "Morning Motivation",
    duration: "4 mins 10 secs",
    date: "20 July, 2025",
  },
  {
    id: "4",
    title: "Loose weight and gain muscles",
    duration: "4 mins 10 secs",
    date: "20 July, 2025",
  },
  {
    id: "5",
    title: "Loose weight and gain muscles",
    duration: "4 mins 10 secs",
    date: "20 July, 2025",
  },
  {
    id: "6",
    title: "Loose weight and gain muscles",
    duration: "4 mins 10 secs",
    date: "20 July, 2025",
  },
  {
    id: "7",
    title: "Loose weight and gain muscles",
    duration: "3 mins 20 secs",
    date: "20 July, 2025",
  },
  {
    id: "8",
    title: "Loose weight and gain muscles",
    duration: "4 mins 20 secs",
    date: "20 July, 2025",
  },
  {
    id: "9",
    title: "Loose weight and gain muscles",
    duration: "4 mins 20 secs",
    date: "20 July, 2025",
  },
  {
    id: "10",
    title: "Loose weight and gain muscles",
    duration: "4 mins 20 secs",
    date: "20 July, 2025",
  },
];

export default function DemoAudiosPage() {
  const [audios, setAudios] = useState<AudioItemProps[]>(mockAudios);

  const handlePlay = (id: string) => console.log("Play:", id);
  const handleDownload = (id: string) => console.log("Download:", id);
  const handleDelete = (id: string) =>
    setAudios((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="w-full max-w-[700px] px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">My Audios</h2>
      <AudioList
        audios={audios}
        onPlay={handlePlay}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
}
