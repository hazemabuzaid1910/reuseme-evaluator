import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { Link, useLocation, useNavigate, useResolvedPath } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job! " },
  ];
}

export default function Resumes() {
    const {auth,fs,kv}=usePuterStore();
    const navigate=useNavigate();
   const [resumes,setResumes]=useState<Resume[]>([])
   const[loadingResume,setLoadingResume]=useState(false)

    useEffect(()=>{
        if(!auth.isAuthenticated){
          console.log(auth.isAuthenticated)
            navigate('/auth?next=/')}
    },[auth.isAuthenticated])
useEffect(() => {
  const loadResumes = async () => {
    try {
      setLoadingResume(true);

      const keys = (await kv.list("resume-*")) as string[];
      console.log("Raw resumes from KV:", keys);

      const parsedResumes: Resume[] = [];

      for (const key of keys) {
  if (!key.startsWith("resume-")) continue;

  const value = await kv.get(key);
  if (!value || value === "undefined") continue;

  try {
    const parsed = JSON.parse(value);
    if (!parsed.resumePath) continue;
    parsedResumes.push(parsed);
  } catch (err) {
    console.error("Failed to parse resume:", key, err);
  }
}

      console.log("Loaded resumes:", parsedResumes);
      setResumes(parsedResumes);
    } catch (error) {
      console.error("Error loading resumes:", error);
      setResumes([]);
    } finally {
      setLoadingResume(false);
    }
  };

  loadResumes();
}, []);

    
  return( 
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

<section className="main-section">
 <div className="flex w-6xl h-[400px] mb-10 items-center justify-between mx-auto  lg:flex-row flex-col gap-8">
<div className=" flex flex-col w-1/2  gap-6 ">
  <div className="flex flex-col w-xl">
    <h1 className="!text-[38px]">Track your Applications & Resume Ratings</h1>

    {!loadingResume && resumes?.length === 0 ? (
      <h2 className="text-gray-700 text-sm">
        No interview questions found yet. Click the button to generate questions!
      </h2>
    ) : (
     <h2 className="!text-[24px]">Review your submissions and check AI-powered feedback.</h2>

    )}
  </div>

    <Link 
      to='/upload' 
      className="primary-button w-fit  "
    >
        Upload Resume
</Link>   
</div>
  <div className="w-1/2 ">
    <img src="/images/Untitled-1-Photoroom.png" alt="" className="w-[90%] object-contain "/>
  </div>
  </div>


{loadingResume&&(
  <div className="flex flex-col items-center justify-center">
    <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
  </div>
)}
{!loadingResume && resumes.length > 0 &&(
  <div className="resumes-section">
    {resumes.map((resume)=>(
<ResumeCard 
  key={resume?.id} 
  resume={{
    ...resume,
    feedback: resume?.feedback || { overallScore: 0, ATS: { score: 0, tips: [] } }
  }} 
/>   ))}
  </div>
)}
{!loadingResume && resumes?.length===0 &&(
  <div className="flex py-5">
    <Link 
      to='/upload' 
      className="primary-button w-fit mt-20 "
    >
        Upload Resume
</Link>     
  </div>
)}
</section>
  </main>)
}