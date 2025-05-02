import { NextRequest, NextResponse } from 'next/server';
import { Client, validateSignature } from '@line/bot-sdk';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// LINE Bot設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const client = new Client(config);

// POST: Webhookからの受信
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-line-signature') || '';
    const body = await req.text();

    // 署名検証
    if (!validateSignature(body, config.channelSecret, signature)) {
      console.error('❌ Invalid signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const { events } = JSON.parse(body);
    console.log('✅ Events received:', events);

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        const text = event.message.text;
        console.log('📩 LINE message:', { userId, text });

        // Firestoreに記録
        await adminDb.collection('entries').add({
          userId: `lineUserId_${userId}`,
          text,
          type: 'record',
          targetDate: Timestamp.fromDate(new Date()),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          status: 'confirmed',
        });
        console.log('✅ Firestore entry saved!');

        // 応答
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: '記録しました📓',
        });
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('❌ Error in LINE Webhook POST:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// GET: Webhook検証用
export async function GET() {
  return new Response('OK', { status: 200 });
}
