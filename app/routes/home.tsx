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
    const {auth}=usePuterStore();
    const navigate=useNavigate();


    useEffect(()=>{
        if(!auth.isAuthenticated){
          console.log(auth.isAuthenticated)
            navigate('/auth?next=/')}
    },[auth.isAuthenticated])

    
  return( 
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

<section className="main-section">
  <div className="page-heading ">
<h1>Analyze Your Resume & Ace Your Interview</h1>
<h2 className="text-lg mt-4 max-w-4xl mx-auto">
  Get instant AI-powered resume insights and personalized interview questions tailored to your dream job.
</h2>


  </div>



  <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4">
    {/* Upload Resume Card */}
    <Link 
      to='/resumes' 
      className="group relative flex-1 bg-gradient-to-br from-blue-400 via-blue-300 to-purple-300 rounded-3xl p-8 shadow-2xl border-2 border-white/20 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] min-h-[380px]"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon badge */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg group-hover:bg-white/30 transition-colors duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="!text-white text-4xl font-bold mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-300">
          Upload Resume
        </h2>
        
        {/* Description */}
        <p className="text-white/90 text-lg mb-6 flex-grow">
          Get instant AI-powered analysis and personalized feedback to optimize your resume
        </p>

        {/* Image container */}
        <div className="flex items-center justify-center mt-auto">
          <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <img 
              src="/images/searching for profile.gif" 
              alt="Upload resume" 
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-8 right-8 text-white/70 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>

    <Link 
      to='/interviews_archive' 
      className="group relative flex-1 bg-gradient-to-br from-purple-400 via-pink-300 to-rose-300 rounded-3xl p-8 shadow-2xl border-2 border-white/20 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)] min-h-[380px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg group-hover:bg-white/30 transition-colors duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="!text-white text-4xl font-bold mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-300">
          Interview Questions
        </h2>
        
        <p className="text-white/90 text-lg mb-6 flex-grow">
          Practice with AI-generated questions tailored to your target role and experience
        </p>

        {/* Image container */}
        <div className="flex items-center justify-center mt-auto">
          <div className="relative w-40 h-40 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <img 
              src="/images/Generate-Initial.gif" 
              alt="Generate questions" 
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="absolute bottom-8 right-8 text-white/70 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  </div>

</section>
  </main>)
}