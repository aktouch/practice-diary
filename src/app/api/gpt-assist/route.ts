// app/api/gpt-assist/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'あなたはユーザーの練習計画や実績記録を支援するコーチです。簡潔に、入力文の内容を整理・提案してください。',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    }),
  });

  console.log('OpenAI status:', res.status); // ← ここを追加
  const data = await res.json();
  console.log('GPT response:', data); // ← これを追加
  const reply = data.choices?.[0]?.message?.content || 'アシストできませんでした。';
  console.log('API_KEY:', process.env.OPENAI_API_KEY);

  return NextResponse.json({ reply });
}

