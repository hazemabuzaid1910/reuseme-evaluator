import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { Link, useLocation, useNavigate, useResolvedPath } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import InterviewCard from "~/components/InterviewCard";
import { FaSearch, FaSearchDollar, FaSearchengin, FaSearchLocation } from "react-icons/fa";
import { TbFlagSearch } from "react-icons/tb";
import { FcSearch } from "react-icons/fc";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job! " },
  ];
}

export default function interviewArchive() {
    const {auth,fs,kv}=usePuterStore();
    const navigate=useNavigate();
   const [questions,setQuestions]=useState<InterviewData[]>([])
   const[loadingResume,setLoadingResume]=useState(false)

useEffect(() => {
  const loadquestions = async () => {
    try {
      setLoadingResume(true);

      const keys = (await kv.list("questions-*")) as string[];
      const parsedquestions: InterviewData[] = [];

      for (const key of keys) {
        if (!key.startsWith("questions-")) continue;

        const value = await kv.get(key);
        if (!value || value === "undefined") continue;

        try {
          const parsed = JSON.parse(value);
          parsedquestions.push(parsed);
        } catch (err) {
          console.error("Failed to parse resume:", key, err);
        }
      }

parsedquestions.sort((a, b) => {
  const da = isNaN(Date.parse(a.date)) ? 0 : Date.parse(a.date);
  const db = isNaN(Date.parse(b.date)) ? 0 : Date.parse(b.date);
  return db- da;
});

      setQuestions(parsedquestions);
      console.log("Loaded sorted questions:", parsedquestions);

    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
    } finally {
      setLoadingResume(false);
    }
  };

  loadquestions();
}, []);


    
  return( 
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

<section className="main-section">
  <div className="flex w-6xl py-10 items-center justify-between mx-auto  lg:flex-row flex-col gap-8">
<div className=" flex flex-col w-1/2  gap-6 mb-6">
  <div className="flex flex-col w-xl">
    <h1 className="text-2xl font-bold text-gray-900">
      Your Interview Questions Archive
    </h1>
    {!loadingResume && questions?.length === 0 ? (
      <h2 className="text-gray-700 text-sm">
        No interview questions found yet. Click the button to generate questions!
      </h2>
    ) : (
      <h2 className="text-gray-700 text-sm">
        Review the interview questions generated for your past submissions.
      </h2>
    )}
  </div>

  <Link
    to="/interview_questions"
    className="primary-button w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
  >
    Generate Interview Questions
  </Link>

</div>
  <div className="w-1/2">
    <img src="/images/ai_generate_question.png" alt="" className="w-full"/>
  </div>
  </div>


{loadingResume&&(
  <div className="flex flex-col items-center justify-center">
    <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
  </div>
)}
{!loadingResume && questions.length > 0 &&(
  <div className="resumes-section !w-7xl flex gap-4">
    {questions.map((questions)=>(
     <InterviewCard key={questions.id} questions={questions} />
  ))}
  </div>
)}
{!loadingResume && questions?.length===0 &&(
     <div className=" flex flex-col gap-6 items-center justify-center p-10  mx-auto">
              <div className='mx-auto w-20 flex items-center  justify-center'>
          <img src="/icons/info.svg" alt="" />
      </div>
          <h2 className="text-gray-700 !text-[24px]">
        No interview questions found yet. Click the button to generate questions!
      </h2>
      </div>
 
)}
</section>
  </main>)
}