// ! ==========>> New Code <<==========
import type { FC, ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import Button from "./common/Button";
import type { Voice, CreateAudioProps } from "../types/CreateAudioTypes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

const CreateAudio: FC<CreateAudioProps> = ({ BASE_URL }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribe = () => {};

    unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        console.error("❌ No authenticated user. Redirect to login.");
        setFirebaseUser(null);
        return;
      }
      setFirebaseUser(user);

      try {
        const idToken = await user.getIdToken(true);

        const res = await fetch(`${BASE_URL}/api/voices`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to fetch voices: ${res.status} - ${errorText}`
          );
        }

        const data = await res.json();
        if (data.voices?.length > 0) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0]);
        }
      } catch (err) {
        console.error("🚨 Error fetching voices:", err);
      }
    });

    return () => unsubscribe();
  }, [BASE_URL]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Accepts a voice object
  const playAudio = async (voice: Voice) => {
    if (!firebaseUser) {
      alert("User not authenticated. Please login.");
      return;
    }

    if (!text.trim()) {
      alert("Please enter text before generating audio.");
      return;
    }

    const voiceId = voice?.voiceId || voice?.voice_id;

    const sentences = text
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // console.log("✅ Sentences:", sentences);
    console.log("🎙️ Voice ID:", voiceId);

    if (!voiceId || !sentences.length) {
      alert("Voice ID or sentences are missing.");
      return;
    }

    setSelectedVoice(voice);
    setLoading(true);
    setAudioUrl(null);

    try {
      //  🔑 Get fresh Firebase ID token
      const idToken = await firebaseUser.getIdToken(true);
      const res = await fetch(`${BASE_URL}/api/merge-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ voiceId, sentences }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Merge error: ${res.status} - ${errorText}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // 🔹 Optional: if you want request IDs from headers
      const requestIdHeader = res.headers.get("request-id");
      if (requestIdHeader) {
        console.log("🆔 Last 3 request IDs:", requestIdHeader);
      }
    } catch (error) {
      console.error("ERROR:", error);
      alert("Failed to generate audio. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="w-[30%] py-20">
        <div className="rounded-xl shadow-lg space-y-10">
          <h1 className="text-4xl font-semibold text-start tracking-wide">
            Enter Script For Audio
          </h1>

          <textarea
            rows={8}
            className="w-full border border-slate-800 rounded-md p-3 outline-none placeholder:text-slate-400"
            placeholder="Enter sentences separated by periods"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
          />

          {/* Custom dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="border border-slate-800 rounded-md p-3 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedVoice ? selectedVoice.name : "Select Voice"}
            </div>

            {dropdownOpen && (
              <ul className="absolute w-full mt-2 border border-slate-800 rounded-md max-h-60 overflow-y-auto z-10">
                {voices.map((voice) => (
                  <li
                    key={voice.voice_id}
                    className="flex justify-between items-center px-4 py-2 group cursor-pointer"
                    onClick={() => {
                      setSelectedVoice(voice);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{voice.name}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent select on play
                        playAudio(voice); // Play that voice
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-purple-700 text-white px-2 py-2 rounded hover:bg-purple-800 cursor-pointer"
                    >
                      ▶
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            onClick={() => selectedVoice && playAudio(selectedVoice)}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating..." : "Get Audio"}
          </Button>

          {audioUrl && (
            <audio controls autoPlay src={audioUrl} className="w-full mt-4" />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateAudio;
