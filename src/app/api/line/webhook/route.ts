import { NextRequest, NextResponse } from 'next/server';
import { Client, middleware, WebhookEvent } from '@line/bot-sdk';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// LINE SDKの設定
const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};

const lineClient = new Client(config);

export async function POST(req: NextRequest) {
  console.log('LINE Webhookにリクエストが到達しました！');
  const body = await req.json();
  console.log(body);

  // LINEからの署名を検証（推奨）
  const signature = req.headers.get('x-line-signature') || '';
  if (!middleware.validateSignature(JSON.stringify(body), config.channelSecret, signature)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const events: WebhookEvent[] = body.events;

  await Promise.all(events.map(handleEvent));

  return new NextResponse('OK', { status: 200 });
}

// イベント処理関数
async function handleEvent(event: WebhookEvent) {
  if (event.type === 'message' && event.message.type === 'text') {
    const message = event.message.text;

    // Firestoreにメッセージを保存
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
