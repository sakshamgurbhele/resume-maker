import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { latexCode } = await req.json();

    if (!latexCode) {
      return NextResponse.json({ error: 'latexCode is required' }, { status: 400 });
    }

    // Attempt to compile using ytotech API via POST
    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          {
            main: true,
            content: latexCode
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("LaTeX Compilation error:", text);
      return NextResponse.json({ error: 'Failed to compile LaTeX to PDF' }, { status: 500 });
    }

    // Fetch the PDF blob buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the response as a downloadable PDF file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
      },
    });
  } catch (error: any) {
    console.error("PDF API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
