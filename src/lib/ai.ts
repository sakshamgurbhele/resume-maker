import OpenAI from 'openai';

// Initialize the OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function scoreResumeAgainstJob(latexResume: string, jobDescription: string): Promise<{ score: number, missingKeywords: string[] }> {
  const prompt = `You are an expert Applicant Tracking System (ATS). 
I will provide you with a Job Description and a candidate's Resume (in LaTeX format).
Your task is to:
1. Extract the most important technical skills, soft skills, and key qualifications from the Job Description.
2. Check if these exact or synonymous keywords are present in the Resume.
3. Calculate an ATS Score from 0 to 100 based on how well the resume matches the job description.
4. List the essential keywords from the Job Description that are MISSING in the resume.

Return ONLY a valid JSON object with the following structure (no markdown fences, no formatting, just pure JSON):
{
  "score": 85,
  "missingKeywords": ["Docker", "Kubernetes", "Agile"]
}

Job Description:
${jobDescription}

Resume (LaTeX):
${latexResume}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: 'You are an expert ATS.' },
        { role: 'user', content: prompt }
      ]
    });

    const text = response.choices[0].message.content || '{}';
    return JSON.parse(text);
  } catch (err: any) {
    console.error("Failed to parse AI response as JSON:", err.message);
    throw new Error(err.message || "Failed to score resume");
  }
}

export async function optimizeResumeWithKeywords(latexResume: string, jobDescription: string, missingKeywords: string[]): Promise<string> {
  const prompt = `You are an expert Resume Writer and LaTeX editor.
I have a resume in LaTeX format, a job description, and a list of missing keywords that need to be added to the resume to pass the ATS.

Your task is to rewrite parts of the LaTeX resume to NATURALLY incorporate the missing keywords. 

based on this job description, transform my resume to align closely with the role to target the role. keep the tone natural and transform the description to match with the job description in order to stand out as a candidate perfect fit for the role. keep the lines short and more technical. the experiences should reflect the skills which are needed by the target job role, as if i have done them hands on during my tenure
- You can add new bullet points under relevant work experiences or projects.
- You can subtly modify existing bullet points to include the skills.
- Ensure the LaTeX syntax remains perfectly valid and compiles without errors.
- Do not remove existing content unless necessary.
- DO NOT wrap the output in markdown code blocks (\`\`\`latex \`\`\`). Return ONLY the raw valid LaTeX code.

Missing Keywords to include:
${missingKeywords.join(', ')}

Job Description (for context):
${jobDescription}

Original LaTeX Resume:
${latexResume}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert Resume Writer and LaTeX editor.' },
        { role: 'user', content: prompt }
      ]
    });

    let text = response.choices[0].message.content || '';

    if (text.startsWith('\`\`\`latex')) {
      text = text.substring(8);
      if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    } else if (text.startsWith('\`\`\`')) {
      text = text.substring(3);
      if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    }
    return text.trim();
  } catch (err: any) {
    console.error("Failed to optimize resume:", err.message);
    throw new Error(err.message || "Failed to optimize resume");
  }
}
