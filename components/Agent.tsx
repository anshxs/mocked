"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Adjust path as needed
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  usermail,
  interviewId,
  feedbackId,
  type,
  profileImage,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("users")
        .select("credits")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Failed to fetch credits", error);
      } else {
        setCredits(data.credits);
      }
      setIsLoadingCredits(false);
    };

    fetchCredits();
  }, [userId]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/dashboard/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
        router.push(`/dashboard/interview/${interviewId}/feedback`);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (credits === null || credits <= 0) return;

    // Decrement credits
    const { error } = await supabase
      .from("users")
      .update({ credits: credits - 1 })
      .eq("id", userId);

    // Fetch the latest experience value before updating
    const { data: profileData, error: fetchExpError } = await supabase
      .from("profiles")
      .select("experience")
      .eq("id", userId)
      .single();

    if (fetchExpError) {
      console.error("Failed to fetch latest experience:", fetchExpError);
      return;
    }

    const newExperience = (profileData?.experience ?? 0) + 20;

    const { error: experror } = await supabase
      .from("profiles")
      .update({ experience: newExperience })
      .eq("id", userId);

    if (experror) {
      console.error("Failed to update experience:", experror);
      return;
    }

    if (error) {
      console.error("Failed to decrement credits:", error);
      return;
    }
    setCredits((prev) => (prev !== null ? prev - 1 : prev));
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      {/* AI Interviewer Card */}
      {(credits === 0 || credits === null) && (
        <div className="bg-red-100 border-2 border-gray-900 text-black px-4 py-3 rounded-2xl mb-4 hover:-translate-0.5 hover:shadow-[6px_6px_0_black]">
          <p>
            You’re out of credits.{" "}
            <Link
              href="/dashboard/credits"
              className="font-semibold underline text-black"
            >
              Buy more here
            </Link>
            .
          </p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 p-7 h-[60vh]  bg-secondary rounded-4xl border flex-1 sm:basis-1/2 w-full relative">
        <div className="flex flex-col items-center justify-center">
          <div className="z-10 p-5 flex items-center justify-center bg-gray-200 rounded-full sm:size-[100px] md:size-[120px] relative">
            <img
              src="/ai-avatar.png"
              alt="profile-image"
              className="object-cover md:w-[65px] md:h-[54px] w-[44px] h-[36px]"
            />
            {isSpeaking && (
              <span className="absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75" />
            )}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        {/* User Profile Card */}
        <div className="rounded-2xl w-fit">
          <div className="bg-gray-200 p-5 px-10 rounded-lg absolute bottom-10 right-10">
            <UserButton />
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="bg-secondary border-2 p-0.5 mt-3 rounded-2xl w-full">
          <div className="bg-secondary rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100",
                "text-black"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-black rounded-2xl min-w-28 cursor-pointer items-center justify-center overflow-visible mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCall}
            disabled={credits === 0 || isLoadingCredits}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-2xl shadow-sm focus:outline-none focus:shadow-2xl active:bg-red-600  min-w-28 mt-6"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
