'use client';

import {useEffect, useState} from 'react';

export type AIProvider = 'gemini' | 'ollama';
const STORAGE_KEY = 'sports-picker:ai-provider';

export default function AIProviderButton({onAnalyze,disabled=false,busy=false}: {
  onAnalyze: (provider: AIProvider) => void | Promise<void>;
  disabled?: boolean;
  busy?: boolean;
}) {
  const [provider,setProvider] = useState<AIProvider>('gemini');
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if(saved === 'gemini' || saved === 'ollama') setProvider(saved);
    } catch { /* Storage can be disabled in private browsing. */ }
  },[]);
  function choose(value: AIProvider) {
    setProvider(value);
    try { window.localStorage.setItem(STORAGE_KEY,value); } catch { /* Optional preference */ }
  }
  return <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border theme-border">
    <button type="button" disabled={disabled||busy} onClick={()=>void onAnalyze(provider)}
      className="px-4 py-2 text-sm font-semibold ai-action-button disabled:cursor-not-allowed disabled:opacity-40">
      {busy ? 'Analyzing…' : `✦ Analyze with ${provider === 'ollama' ? 'Ollama' : 'Gemini'}`}
    </button>
    <label className="border-l theme-border theme-surface-raised">
      <span className="sr-only">AI provider</span>
      <select aria-label="AI provider" disabled={busy} value={provider}
        onChange={e=>choose(e.target.value as AIProvider)}
        className="h-full cursor-pointer bg-transparent px-2 text-xs outline-none disabled:opacity-40">
        <option value="gemini">Gemini</option>
        <option value="ollama">Ollama</option>
      </select>
    </label>
  </div>;
}
