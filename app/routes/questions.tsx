import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../components/Accordion";
import { CorrectAnswers } from "../../constants/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Questions() {
  const { kv, ai } = usePuterStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<any>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const loadResume = async () => {
      setLoadingResume(true);
      const resumeData = await kv.get(`questions-${id}`);
      if (resumeData) {
        const parsed = JSON.parse(resumeData);
        setResume(parsed);
        console.log("Questions data:", parsed);
      }
      setLoadingResume(false);
    };
    loadResume();
  }, [id]);

  const handleInputChange = (index: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmitAll = async () => {
    if (!resume) return;

    const updatedQuestions = resume.questions.questions.map((q: any, i: number) => {
      const userAnswer = userAnswers[i];
      if (userAnswer?.trim()) {
        return { ...q, userAnswer: userAnswer.trim() };
      }
      return q;
    });

    let result;
    try {
      result = await ai.chat(
        CorrectAnswers({
          test: resume,
          questions: { questions: updatedQuestions },
        })
      );
    } catch (e) {
      console.error("AI error:", e);
      alert("Error connecting to AI. Try again.");
      return;
    }

    if (!result?.message?.content) {
      alert("No response from AI. Please try again.");
      return;
    }

    const feedbackText = typeof result.message.content === "string"
      ? result.message.content
      : result.message.content[0].text;

    let parsedJson;
    try {
      parsedJson = JSON.parse(feedbackText);
    } catch (e) {
      console.error("Invalid JSON:", e);
      alert("AI returned invalid JSON. Please try again.");
      return;
    }

    console.log("Feedback:", parsedJson);

    // تحديث resume بالنتائج
    const newResume = {
      ...resume,
      questions: { questions: parsedJson.questions },
    };
    setResume(newResume);

    // تحديث التخزين
    await kv.set(`questions-${id}`, JSON.stringify(newResume));

    alert("✅ Evaluation complete!");
  };

const hasUnanswered = resume?.questions?.questions?.some(
  (q: any) => !q.userAnswer && !q.aiAnswer &&!q.answer
);
  const getAnswerColor = (score: number) => {
    if (score > 70) return "bg-green-200 border-green-600";
    if (score >= 50) return "bg-yellow-200 border-yellow-600";
    return "bg-red-200 border-red-600";
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section w-5xl mx-auto py-8">
        {loadingResume && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              className="w-[200px]"
              alt="loading"
            />
          </div>
        )}

        {!loadingResume && resume ? (
          <div className="mb-10 p-4 bg-white/20 rounded-xl relative">
            {hasUnanswered &&(
              <button
                onClick={() => setShowAnswers((prev) => !prev)}
                className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {showAnswers ? "Hide Answers" : "Answer Questions"}
              </button>
            )}

            <h2 className="text-2xl font-bold mb-6 text-white">
              {resume.jobTitle} @ {resume.companyName}
            </h2>

            {resume.questions?.questions?.map((q: any, i: number) => (
              <div key={i} className="mb-4">
                {q.userAnswer || q.aiAnswer || q.answer ? (

                  <Accordion>
                    <AccordionItem id={`question-${i}`}>
                      <AccordionHeader itemId={`question-${i}`} >
                        {`${i + 1}. ${q.question} (${q.type})`}
                      </AccordionHeader>
                      <AccordionContent
                        itemId={`question-${i}`}
                        className={cn(
                          "overflow-hidden transition-all duration-1000 ease-in-out p-4 border-l-4 rounded",
                         q.aiAnswer? getAnswerColor(q.score):"bg-white/10 border-green-500"
                        )}
                      >
                        <p><span className="font-semibold">Answer: </span>{q.userAnswer || q.aiAnswer||q.answer}</p>
                        {q.aiAnswer&&<p><span className="font-semibold">Score: </span>{q.score}</p>}
                        {q.aiAnswer&&<p><span className="font-semibold">Notes: </span>{q.notes}</p>}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {`${i + 1}. ${q.question}`}
                    </h3>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        showAnswers
                          ? "max-h-[200px] opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <textarea
                        className="w-full p-2 rounded bg-white/20 placeholder-white/70"
                        placeholder="Write your answer..."
                        value={userAnswers[i] || ""}
                        onChange={(e) => handleInputChange(i, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {showAnswers && hasUnanswered && (
              <div className="flex justify-center mt-6">
                <button
                  className={cn(
                    "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  )}
                  onClick={handleSubmitAll}
                >
                  Submit All Answers
                </button>
              </div>
            )}
          </div>
        ) : (
          !loadingResume && (
            <h2 className="text-white/70 text-center">No resume loaded</h2>
          )
        )}
      </section>
    </main>
  );
}
