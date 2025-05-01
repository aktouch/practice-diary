import { NextRequest, NextResponse } from 'next/server';
import { validateSignature, Client, WebhookEvent } from '@line/bot-sdk';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};

const lineClient = new Client(config);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-line-signature') || '';
  const rawBody = await req.text();

  // 署名検証（正しいLINEリクエストか）
  const isValid = validateSignature(rawBody, config.channelSecret, signature);
  if (!isValid) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const events: WebhookEvent[] = body.events;

  await Promise.all(events.map(handleEvent));

  return new NextResponse('OK', { status: 200 });
}

async function handleEvent(event: WebhookEvent) {
  if (event.type === 'message' && event.message.type === 'text') {
    const message = event.message.text;

    // Firestore に保存
    await addDoc(collection(db, 'entries'), {
      content: message,
      source: 'line',
      createdAt: serverTimestamp(),
      targetDate: serverTimestamp(),
    });

    // ユーザーに返信（任意）
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: '練習記録を登録しました！',
    });
  }
}

