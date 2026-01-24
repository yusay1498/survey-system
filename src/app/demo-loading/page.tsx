"use client";

import { useState } from "react";
import { Spinner, LoadingScreen } from "@/components/ui";

/**
 * Demo page to showcase the loading animations
 * This page demonstrates all the loading states with Pines animations
 */
export default function DemoLoadingPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);

  if (showFullScreen) {
    return <LoadingScreen message="デモの読み込み中..." />;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Loading Animations Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pinesのアニメーションを使った読み込みコンポーネントのデモ
          </p>
        </div>

        {/* Spinner Sizes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Spinner サイズバリエーション
          </h2>
          <div className="flex items-center gap-8">
            <div className="text-center space-y-2">
              <Spinner size="sm" label="小サイズ" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Small</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="md" label="中サイズ" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
            </div>
            <div className="text-center space-y-2">
              <Spinner size="lg" label="大サイズ" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Large</p>
            </div>
          </div>
        </div>

        {/* Inline with Text */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            インラインでの使用例
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Spinner size="sm" label="送信中..." />
              <span className="text-gray-700 dark:text-gray-300">送信中...</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
              <Spinner size="sm" label="ログイン中..." />
              ログイン中
            </button>
          </div>
        </div>

        {/* Centered Loading */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            センタリングされた読み込み
          </h2>
          <div className="h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
            <div className="text-center space-y-3">
              <Spinner size="lg" label="データを読み込んでいます..." />
              <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                データを読み込んでいます...
              </p>
            </div>
          </div>
        </div>

        {/* Full Screen Demo Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            フルスクリーン読み込み画面
          </h2>
          <button
            onClick={() => {
              setShowFullScreen(true);
              setTimeout(() => setShowFullScreen(false), 3000);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            フルスクリーン読み込みを表示（3秒間）
          </button>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            特徴
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Pinesのアニメーションパターンを使用</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>アクセシビリティ対応（aria-label, role=&quot;status&quot;）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>ダークモード対応</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>3つのサイズバリエーション（sm, md, lg）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>bulletproof-reactの構造に従った配置</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
