# AI Resume Tailor

AI Resume Tailor (ResumeMaker) is a Next.js-based web application that helps you optimize your LaTeX resume for specific job descriptions. By leveraging OpenAI's advanced models (GPT-4o), it analyzes your resume against a target job description, identifies missing keywords, and automatically rewrites your resume content to dramatically improve your Applicant Tracking System (ATS) score.

## Features

- **LaTeX Resume Parsing**: Paste your existing `.tex` source code directly into the app.
- **Job Description Analysis**: Automatically extracts key technical skills, soft skills, and qualifications.
- **ATS Scoring & Missing Keywords**: Evaluates your current resume and provides an ATS score out of 100, highlighting missing keywords.
- **AI-Powered Optimization**: Naturally seamlessly integrates missing keywords into your bullet points without breaking LaTeX syntax.
- **Live Progress Tracking**: Streamed progress let you see the AI's step-by-step optimization process.
- **Export Options**: Download the optimized `.tex` source code or compile it directly into a `.pdf` file.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [OpenAI SDK](https://platform.openai.com/docs/) (`gpt-4o` & `gpt-4o-mini`)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- An active [OpenAI API Key](https://platform.openai.com/api-keys)

*(Note: LaTeX compilation requires pdflatex or a similar compiler available on the host machine/server for the PDF generation feature to work via `/api/compile-pdf`)*

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd ResumeMaker
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Create a \`.env.local\` file in the root of your project and add your OpenAI API Key:
\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Guide

1. **Input Original Resume**: Paste your LaTeX (`.tex`) resume code into the "Original LaTeX Resume" text area.
2. **Input Job Description**: Paste the target job description into the "Job Description" text area.
3. **Optimize**: Click the "Start Optimization" button.
4. **Review Results**: Watch the progress log as the AI analyzes and rewrites your resume. Once complete, your new ATS score will be displayed.
5. **Download**: Choose to download either the raw `.tex` file or the compiled `PDF` file using the provided buttons.

## Troubleshooting

- **PDF Compilation Fails**: Ensure that the optimized LaTeX code doesn't contain invalid syntax that breaking compilation. Also, ensure the host environment running the Next.js server has a valid LaTeX distribution (like TeX Live) installed.
- **API Errors**: Ensure your `OPENAI_API_KEY` is properly configured and has sufficient quota/billing enabled.
