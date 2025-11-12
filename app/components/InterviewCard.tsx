import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa'; // 👈 أيقونة السؤال
import { Link } from 'react-router';

interface Question {
  question: string;
  answer?: string;
  type: 'technical' | 'behavioral' | string;
}

interface NestedQuestions {
  questions: Question[];
}

interface InterviewData {
  id: string;
  companyName: string;
  jobTitle: string;
  questions: NestedQuestions;
  date:string;
}

function InterviewCard({ questions }: { questions: InterviewData }) {
  console.log("InterviewCard questions:", questions);

  const s = questions.questions.questions.slice(0, 6) ?? [];

  return (
  <Link to={`/questions/${questions.id}`} >
    <div className="interview-card bg-gradient-to-br from-purple-300 via-pink-200 to-rose-200 overflow-hidden h-[400px] w-[400px] p-4 rounded-lg shadow-xl mb-4 relative">
      <div className="absolute top-4 right-4 text-white text-3xl drop-shadow-md">
        <FaQuestionCircle />
      </div>

      <h2 className="font-semibold text-white text-lg mt-2">{questions.companyName}</h2>
      <h3 className="font-semibold text-white text-2xl ">{questions.jobTitle}</h3>
      <p className="font-semibold text-white/60 text-sm mb-6">{questions.date}</p>
<div className='w-60 h-70 mx-auto'>
    <img src="/images/testCard-background.png" className='w-full h-full' alt="" />

</div>
    </div>
    </Link>
  );
}

export default InterviewCard;
