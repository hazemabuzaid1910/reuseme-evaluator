import { prepareQuestions } from '../../constants/index';
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '~/components/Navbar';
import { generateUUID } from '~/lib/formatSize';
import { usePuterStore } from '~/lib/puter';

function InterviewQuestions() {
  const { auth, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);
const [isAnswered, setIsAnswered] = useState(false);

  const handleAnalyse = async ({
    companyName,
    jobTitle,
    jobDescription,
    isAnswered,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    isAnswered: boolean;
  }) => {
    setIsProcessing(true);
    setStatusText('Analyzing job details...');
    setStatusText('Generating interview questions...');
const date = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric"
});
    const iuid = generateUUID();
    const data = {
      id: iuid,
      companyName,
      jobTitle,
      questions: [],
      date
    };

    await kv.set(`questions-${iuid}`, JSON.stringify(data));
    setStatusText('Preparing AI prompt...');

    let questions;
    try {
      questions = await ai.chat(
        prepareQuestions({ jobTitle, jobDescription, isAnswered })
      );
      console.log('Raw AI feedback:', questions);
    } catch (err) {
      console.error('AI feedback error:', err);
      setIsProcessing(false);
      setStatusText('Failed to generate interview questions.');
      return;
    }

    if (!questions) {
      setIsProcessing(false);
      return setStatusText('No response from AI. Please try again.');
    }

    console.log('AI feedback done ✅');

    const feedbackText =
      typeof questions.message.content === 'string'
        ? questions.message.content
        : questions.message.content[0].text;

    data.questions = JSON.parse(feedbackText);
    await kv.set(`questions-${iuid}`, JSON.stringify(data));
    setStatusText('Questions generated successfully!');
    console.log(data);

    try {
     navigate(`/questions/${iuid}`);
    } catch (navErr) {
      console.error('Navigation failed', navErr);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const companyName = (formData.get('company-name') || '') as string;
    const jobTitle = (formData.get('job-title') || '') as string;
    const jobDescription = (formData.get('job-description') || '') as string;

    console.log('isAnswered:', isAnswered);

    await handleAnalyse({ companyName, jobTitle, jobDescription, isAnswered });
  }



  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading ">
          <h1>Generate Interview Questions</h1>
         

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt=""
                className="w-full mt-6"
              />
            </>
          ) : (
           <h2 className=" text-lg  max-w-5xl mx-auto">
              Upload your  job details to get AI-generated interview
              questions tailored to your target position.
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job title"
                  id="job-title"
                  required
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                ></textarea>
              </div>

             <div className="form-div flex items-center justify-between">
  <label htmlFor="isanswered" className="text-lg">
    Include Suggested Answers
  </label>
  
  <button
    type="button"
    onClick={() => setIsAnswered((prev) => !prev)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      isAnswered ? 'bg-green-500' : 'bg-gray-400'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        isAnswered ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
</div>


              <button
                className="primary-button"
                type="submit"
                disabled={isProcessing}
              >
                Generate Questions
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default InterviewQuestions;
