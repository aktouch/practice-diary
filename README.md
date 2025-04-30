# 🏃‍♂️ Practice Diary - ランナーのための練習記録アプリ

https://practice-diary-two.vercel.app/ 
（実際の動作はこちらからご覧いただけます）

---

## 📌 概要

日々の練習記録（計画・実績）をカレンダー形式で管理できる、ランナー向けの記録アプリです。  
Googleログイン対応・Firestore連携済みで、今後GPTによるサマリ生成やStrava連携なども予定。

---

## 🛠️ 使用技術・構成

| 項目 | 使用技術 |
|:--|:--|
| フロントエンド | Next.js（App Router / TypeScript / TailwindCSS） |
| バックエンド（BaaS） | Firebase（Authentication / Firestore） |
| デプロイ | Vercel |
| その他 | date-fns（カレンダー・日付処理） |

---

## ✍️ 機能（v0.1）

- ✅ Googleアカウントでログイン
- ✅ カレンダーから日付を選択して練習記録を作成
- ✅ 練習の種類（計画 / 実績）をラベル付きで投稿・表示
- ✅ Firestoreに記録を保存＆日付単位で取得
- ✅ レスポンシブ対応（モバイルでも確認可能）

---

## 📱 使い方

1. Googleログイン
2. カレンダーから日付を選択
3. 練習メモを記入（例：「20分jog＋WS×3」）
4. 「投稿する」ボタンでFirestoreに保存
5. 記録がスレッド形式で時系列表示されます

---

## 🔮 今後の機能追加予定（v0.2以降）

- 🤖 GPT APIによる記録内容のサマリ / 傾向分析
- 📈 Strava APIからの走行データ自動同期
- 📆 LINE Bot からのリマインド投稿
- 🧠 AIが提案する練習メニュー → カレンダーへスライド追加
- 🗓️ 月間走行距離・練習分布の自動集計と可視化

---

## 🧪 デモURL（公開中）

➡️ https://practice-diary-two.vercel.app/

---

