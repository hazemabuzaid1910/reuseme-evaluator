import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default
 [
    index("routes/home.tsx"),
    route("/auth","routes/auth.tsx"),
    route("/upload","routes/upload.tsx"),
    route('/resume/:id' ,'routes/resume.tsx'),
    route('/wipe' ,'routes/wipe.tsx'),
    route('/interview_questions' ,'routes/interview_questions.tsx'),
    route('/resumes' ,'routes/resumes.tsx'),
    route('/questions/:id' ,'routes/questions.tsx'),
    route('/interviews_archive' ,'routes/interviewsArchive.tsx'),




 ] satisfies RouteConfig;
