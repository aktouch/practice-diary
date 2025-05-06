# 🏃‍♂️ Practice Diary（練習日誌アプリ）

個人練習を記録・分析できるアスリート向けアプリです。
Googleログインで記録し、LINE連携で通知や簡単入力も対応。

## 🌐 Webアプリ（公開版）
[https://practice-diary-dzhy.vercel.app](https://practice-diary-dzhy.vercel.app)

- Googleアカウントでログイン後、練習記録をカレンダー形式で確認できます
- Firestore を用いた append-only ログ設計
- GPT による要約機能（開発中）

## 💬 LINE連携（Bot）
- [LINEでBotを追加](https://lin.ee/fFbx6Gf) ←ここに**友だち追加用URL**を記載
- 毎晩21時に「今日の練習を記録しよう！」と通知
- メニューからWeb版にもアクセス可能（外部ブラウザ起動）

## 🛠 技術構成
- Frontend: Next.js (App Router, TypeScript)
- Backend: Firebase Auth / Firestore / Functions
- Notification: GitHub Actions + LINE Messaging API
- AI連携: OpenAI GPT (予定)

## 🔜 今後の開発予定（v0.7以降）
- LINE風チャットUIでGPTからのフィードバックを表示
- Strava自動連携（距離/ペースの取得）
- スマホアプリ化（Flutter対応）

---

