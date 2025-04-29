# Practice Diary App (Runlog)

このアプリは、日々の練習記録を「計画」「実績」として記録・振り返りできるWebアプリです。
Googleログインを使って個人の記録を安全に管理し、将来的にLINE投稿やAIによる要約・提案機能の追加を予定しています。

## ✅ 現在のMVP機能

- Googleログイン認証
- 月間カレンダーで日付ごとの記録表示
- 「計画」または「実績」の練習メモ投稿
- 投稿は追記式（削除・編集なし）
- Firestoreによるクラウド保存

## 🔧 使用技術

- Next.js App Router
- TypeScript
- Firebase（Authentication, Firestore）
- Tailwind CSS

## 🧩 今後の開発予定（例）

- LINE投稿Botとの連携
- Stravaデータ自動取得
- GPTによる練習内容の要約・傾向分析
- プランニング機能（GPT提案 + カレンダーへのドラッグ）

## 📂 開発方法

```bash
git clone https://github.com/YOUR_USERNAME/practice-diary.git
cd practice-diary
npm install
