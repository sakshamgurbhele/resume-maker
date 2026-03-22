# 📝 AI Resume Tailor (ResumeMaker)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

**Bridge the gap between your resume and the recruiter's ATS.** AI Resume Tailor is a high-performance web application built with **Next.js 14** that helps job seekers optimize their LaTeX resumes. By leveraging **GPT-4o**, it intelligently analyzes job descriptions, identifies missing keywords, and rewrites resume bullet points while strictly preserving your LaTeX syntax.

---

## ✨ Key Features

* **🔍 LaTeX-Native Analysis**: No need to convert to Word. Paste your `.tex` source directly.
* **📊 Real-time ATS Scoring**: Get an instant score out of 100 based on job description relevancy.
* **🧠 Intelligent Keyword Injection**: Naturally weaves technical and soft skills into your experience.
* **⚡ Live Streamed Progress**: Watch the AI’s "thought process" as it identifies gaps and rewrites sections.
* **📄 Dual Export**: Download the refined `.tex` source or a compiled PDF in one click.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **AI Engine** | [OpenAI SDK](https://platform.openai.com/docs/) (`gpt-4o` & `gpt-4o-mini`) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0+ 
* **OpenAI API Key**: [Get one here](https://platform.openai.com/api-keys)
* **LaTeX Environment**: (Optional) `pdflatex` must be installed on your host machine/server for the PDF generation feature.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/sakshamgurbhele/resume-generator.git](https://github.com/sakshamgurbhele/resume-generator.git)
    cd ResumeMaker
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Launch the Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to start optimizing.

---

## 📖 Usage Guide

1.  **Input**: Paste your raw LaTeX code and the target job description.
2.  **Analyze**: Click **Start Optimization**. The AI extracts key requirements and compares them to your content.
3.  **Refine**: The system generates an ATS-optimized version of your resume in real-time.
4.  **Export**: Review the changes and download your updated `.tex` file or the compiled `.pdf`.

---

## ⚠️ Important Notes

> [!CAUTION]
> **API Security**: Never commit your `.env.local` file. Ensure it is listed in your `.gitignore` to protect your OpenAI credits.

* **PDF Compilation**: If PDF generation fails, ensure your LaTeX code doesn't use custom packages that are missing from your server's TeX distribution.
* **Keyword Density**: While the AI focuses on ATS optimization, always perform a final manual review to ensure the "human" tone of your achievements remains intact.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request