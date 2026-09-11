import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables.
// If missing, it won't crash on boot, but will fail when sending.
const resend = new Resend(process.env.RESEND_API_KEY || 'fallback_key');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real scenario without an API key, we might want to simulate success
    // to keep the frontend working for demo purposes.
    if (!process.env.RESEND_API_KEY) {
      console.log('Simulating email send (No RESEND_API_KEY found):', { name, email, subject, message });
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, simulated: true });
    }

    const data = await resend.emails.send({
      from: 'Salam Consulting Contact <onboarding@resend.dev>',
      to: 'info@salamconsulting.com', // In a real app, you would send to your verified domain
      replyTo: email,
      subject: `New Contact Request: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
