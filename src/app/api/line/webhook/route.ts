import { NextRequest, NextResponse } from 'next/server';
import { Client, validateSignature } from '@line/bot-sdk';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const client = new Client(config);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-line-signature') || '';
  const body = await req.text();

  // 🔐 署名検証
  if (!validateSignature(body, config.channelSecret, signature)) {
    console.error('❌ Invalid signature');
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const { events } = JSON.parse(body);
  console.log('✅ Events received:', events);

  // ⚡ 先に応答を返す
  const response = new NextResponse('OK', { status: 200 });

  // 🔄 非同期で処理を継続
  events.forEach(async (event: any) => {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        const text = event.message.text;
        console.log('📩 LINE message:', { userId, text });

        // Firestoreへ保存
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

        // LINE応答
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: '記録しました📓',
        });
      }
    } catch (err) {
      console.error('❌ LINE message processing error:', err);
    }
  });

  return response;
}

export async function GET() {
  return new Response('OK', { status: 200 });
}
