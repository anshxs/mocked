"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { cn, getRandomInterviewCover } from "@/lib/utils";

type InterviewCardProps = {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  feedback: {
    total_score: number;
    final_assessment: string;
    created_at: string;
  } | null;
};

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-gray-400",
      Mixed: "bg-gray-600",
      Technical: "bg-gray-800",
    }[normalizedType] || "bg-gray-600";

  const formattedDate = dayjs(
    feedback?.created_at || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="rounded-2xl w-[360px] max-sm:w-full min-h-96 border-2">
      <div className="bg-secondary rounded-2xl min-h-full flex flex-col p-6 relative overflow-hidden gap-10 justify-between">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="text-sm font-semibold text-white capitalize">
              {normalizedType}
            </p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />

          {/* Interview Role */}
          <h3 className="mt-5 font-bold capitalize">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
                className="filter invert-0 brightness-0 contrast-100"
              />
              <p>{feedback?.created_at
                                ? dayjs(feedback.created_at).format("MMM D, YYYY h:mm A")
                                : formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/star.svg"
                width={22}
                height={22}
                alt="star"
                className="filter invert-0 brightness-0 contrast-100"
              />
              <p>{feedback?.total_score ?? "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.final_assessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="w-fit bg-black text-white hover:bg-black rounded-xl font-bold px-5 cursor-pointer min-h-10">
  <Link
    href={
      feedback
        ? `/dashboard/interview/${interviewId}/feedback`
        : `/dashboard/interview/${interviewId}`
    }
  >
    {feedback ? "Check Feedback" : "View Interview"}
  </Link>
</Button>

        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
