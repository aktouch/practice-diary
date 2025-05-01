'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white border-b px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* 左：ロゴ */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-800">
          練習日誌
        </Link>

        {/* 右：ユーザー情報 or ログイン */}
        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-700">{user.displayName}</span>
            <button
              onClick={() => signOut()}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition">
              ログイン
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
