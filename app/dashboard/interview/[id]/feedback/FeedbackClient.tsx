'use client';

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface FeedbackClientProps {
  interviewId: string;
  interview: {
    role: string;
  };
}

const FeedbackClient = ({ interviewId, interview }: FeedbackClientProps) => {
  const user = useUser();
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      getFeedbackByInterviewId({ interviewId, userId: user.id }).then(setFeedback);
      console.log("Feedback", feedback);
      console.log("InterviewId:", interviewId);
    }
  }, [user]);

  if (!feedback) return <p>Loading feedback...</p>;

  return (
    <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 my-4">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-black font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category: any, index: number) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
  <h3>Strengths</h3>
  <ul>
    {(Array.isArray(feedback?.strengths) ? feedback.strengths : []).map((strength: string, index: number) => (
      <li key={index}>{strength}</li>
    ))}
  </ul>
</div>


      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center">
        <Button className="w-fit !bg-dark-200 !text-primary-200 hover:!bg-dark-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="w-fit !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 flex-1">
          <Link href={`/interview/${interviewId}`} className="flex w-full justify-center">
            <p className="text-sm font-semibold text-white text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackClient;
