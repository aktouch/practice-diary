// src/components/Header.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          練習日誌
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || ''}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>{user.displayName}</span>
            </div>
            <button 
              onClick={() => signOut()} 
              className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded text-sm"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded text-sm">
              ログイン
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}