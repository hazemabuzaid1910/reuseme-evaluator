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

export default function Home() {
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

      // تجلب كل المفاتيح التي تبدأ بـ resume-
      const keys = (await kv.list("resume-*")) as string[];
      console.log("Raw resumes from KV:", keys);

      const parsedResumes: Resume[] = [];

      for (const key of keys) {
        try {
          const value = await kv.get(key);
          if (!value || value === "undefined") {
            console.warn("Skipped invalid resume:", key);
            continue;
          }

          const parsed = JSON.parse(value) as Resume;
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
  <div className="page-heading py-16">
<h1>Track your Applications & Resume Ratings</h1>
{!loadingResume&& resumes?.length===0 ?(
  <h2>
    No Resumes found. Upload your resume to get started!  
  </h2>
):(
<h2>Review your submissions and check AI-powered feedback.</h2>
)
}

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
  <div className="flex flex-col items-center mt-10 gap-4">
    <Link to='/upload' className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
  </div>
)}
</section>
  </main>)
}
