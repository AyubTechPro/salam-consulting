import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, locale = 'en', telemetry = {} } = body;

    // Validate input fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Capture Advanced Metadata (Silicon Valley Style Analytics)
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const vercelCountry = req.headers.get('x-vercel-ip-country');
    const vercelCity = req.headers.get('x-vercel-ip-city');
    const backendReferrer = req.headers.get('referer') || 'Direct';

    const finalReferrer = telemetry.referrer || backendReferrer;
    const finalCountry = telemetry.country || vercelCountry || 'Unknown';
    const finalCity = telemetry.city || vercelCity || 'Unknown';

    // 1. PUSH TO SUPABASE CRM (Silent fail if keys missing so app doesn't break)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            subject,
            message,
            user_agent: userAgent,
            ip_address: ipAddress,
            referrer: finalReferrer,
            status: 'new',
            utm_source: telemetry.utm_source,
            utm_medium: telemetry.utm_medium,
            utm_campaign: telemetry.utm_campaign,
            device_type: telemetry.device_type,
            browser: telemetry.browser,
            os: telemetry.os,
            country: finalCountry,
            city: finalCity
          }
        ]);
        
      if (dbError) {
        console.error('Supabase CRM Error:', dbError);
        // We don't fail the request here, just log it.
      }
    } else {
      console.log('Skipping Supabase insert: Missing API keys in .env');
    }

    // If no Resend API key, simulate success
    if (!resendApiKey || !resend) {
      console.log('Simulating email send (No RESEND_API_KEY found). Data:', { name, email, subject, message });
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, simulated: true });
    }

    const fromEmail = process.env.EMAIL_FROM || 'Salam Consulting <onboarding@resend.dev>';
    const toEmail = process.env.EMAIL_TO || 'info@salamconsultingedu.com';

    // 2. SEND NOTIFICATION TO ADMIN
    const adminEmailPromise = resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Lead 🔥: ${name} - ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Lead Captured! 🚀</h2>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <div style="font-size: 12px; color: #64748b; border-top: 1px solid #eee; padding-top: 15px;">
            <p><strong>Smart Data (Analytics):</strong></p>
            <p>IP: ${ipAddress}</p>
            <p>Referrer: ${finalReferrer}</p>
            <p>Device: ${userAgent}</p>
          </div>
        </div>
      `,
    });

    // 3. SEND AUTOMATED 'THANK YOU' EMAIL TO THE USER (Silicon Valley Standard)
    // Localization
    const translations: Record<string, any> = {
      en: {
        subject: 'Inquiry Received - Salam Consulting',
        hello: `Hello ${name.split(' ')[0]},`,
        received: 'Thank you for reaching out to <strong>Salam Consulting</strong>. We have successfully received your inquiry.',
        reviewing: 'Our team is currently reviewing your message and will get back to you shortly to discuss how we can assist you.',
        quote: '"Empowering global leaders through world-class educational consulting."'
      },
      tg: {
        subject: 'Дархост қабул шуд - Salam Consulting',
        hello: `Салом ${name.split(' ')[0]},`,
        received: 'Ташаккур барои тамос бо <strong>Salam Consulting</strong>. Мо дархости шуморо бо муваффақият қабул кардем.',
        reviewing: 'Гурӯҳи мо айни ҳол паёми шуморо баррасӣ дорад ва ба зудӣ бо шумо тамос хоҳад гирифт.',
        quote: '"Омодасозии пешвоёни ҷаҳонӣ тавассути машваратҳои таълимии сатҳи олӣ."'
      },
      ru: {
        subject: 'Запрос получен - Salam Consulting',
        hello: `Здравствуйте ${name.split(' ')[0]},`,
        received: 'Спасибо за обращение в <strong>Salam Consulting</strong>. Мы успешно получили ваш запрос.',
        reviewing: 'Наша команда в настоящее время рассматривает ваше сообщение и свяжется с вами в ближайшее время.',
        quote: '"Подготовка мировых лидеров через образовательный консалтинг мирового класса."'
      }
    };
    const t = translations[locale] || translations.en;

    const userEmailPromise = resend.emails.send({
      from: fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://www.salamconsultingedu.com/logo/salamconsulting-logo-original.png" alt="Salam Consulting Logo" width="280" style="display: block; margin: 0 auto;" />
          </div>
          
          <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 24px;">
            ${t.hello}
          </h1>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${t.received}
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            ${t.reviewing}
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin-bottom: 32px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #1e293b; font-size: 15px; font-style: italic;">
              ${t.quote}
            </p>
          </div>

          
          <div style="margin-bottom: 40px;">
            <a href="https://www.salamconsultingedu.com" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">
              Visit Our Website
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            Salam Consulting &bull; Headquartered in Dushanbe, Tajikistan<br/>
            <a href="mailto:info@salamconsultingedu.com" style="color: #2563eb; text-decoration: none;">info@salamconsultingedu.com</a>
          </p>
        </div>
      `,
    });

    // Run both emails in parallel for speed
    const [adminResult, userResult] = await Promise.all([adminEmailPromise, userEmailPromise]);

    if (adminResult.error || userResult.error) {
      console.error('Resend API Error:', adminResult.error || userResult.error);
      return NextResponse.json(
        { error: 'Failed to send message via Resend' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, adminResult, userResult });
  } catch (error) {
    console.error('Contact API Internal Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
