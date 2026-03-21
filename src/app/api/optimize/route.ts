import { NextResponse } from 'next/server';
import { scoreResumeAgainstJob, optimizeResumeWithKeywords } from '@/lib/ai';

export const maxDuration = 60; // Allow 60 seconds on hobby plan (Vercel) just in case

export async function POST(req: Request) {
  try {
    const { latexCode, jobDescription } = await req.json();

    if (!latexCode || !jobDescription) {
      return NextResponse.json({ error: 'latexCode and jobDescription are required' }, { status: 400 });
    }

    let currentLatex = latexCode;
    let finalScore = 0;
    let missing: string[] = [];
    let iterations = 0;

    // Safety cap at 10 iterations to prevent infinite loop or excessive cost
    const maxIterations = 5;

    // Send the first response as a Stream? Next.js App Router streaming is complex,
    // For simplicity, we'll run the loop on the server and return the final state,
    // or we can stream the progress using Server-Sent Events.
    // SSE is better for frontend progress bars! Let's implement Server Sent Events.

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          while (iterations < maxIterations) {
            iterations++;
            sendEvent('progress', { message: `Iteration ${iterations}: Analyzing resume against Job Description...` });

            const { score, missingKeywords } = await scoreResumeAgainstJob(currentLatex, jobDescription);
            finalScore = score;
            missing = missingKeywords || [];

            sendEvent('progress', { message: `Iteration ${iterations} Score: ${score}/100. Missing Keywords: ${missing.length}` });

            if (score >= 90) {
              sendEvent('progress', { message: `Target score reached! Final Score: ${score}. Finishing up...` });
              break;
            }

            if (missing.length === 0) {
              sendEvent('progress', { message: `No missing keywords found, but score is ${score}. Ending loop.` });
              break;
            }

            sendEvent('progress', { message: `Iteration ${iterations}: Optimizing LaTeX with missing keywords...` });
            currentLatex = await optimizeResumeWithKeywords(currentLatex, jobDescription, missing);
          }

          if (iterations >= maxIterations) {
            sendEvent('progress', { message: `Reached maximum iterations. Stopped with score: ${finalScore}` });
          }

          sendEvent('complete', {
            latex: currentLatex,
            score: finalScore,
            missingKeywords: missing
          });

          controller.close();
        } catch (err: any) {
          sendEvent('error', { message: err.message || 'An error occurred during optimization.' });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Optimize Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
