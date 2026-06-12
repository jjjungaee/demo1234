'use client';

import { useState } from 'react';

interface Notebook {
  id: number;
  name: string;
  note_count: number;
}

interface SidebarProps {
  notebooks: Notebook[];
  selectedNotebook: number | null;
  onSelectNotebook: (id: number | null) => void;
  onCreateNotebook: (name: string) => void;
  onDeleteNotebook: (id: number) => void;
}

export default function Sidebar({
  notebooks,
  selectedNotebook,
  onSelectNotebook,
  onCreateNotebook,
  onDeleteNotebook,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateNotebook(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-56 bg-[#1A2E25] text-white flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-[#2D4A3C]">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight">메모장</span>
      </div>

      {/* All Notes */}
      <nav className="px-2 py-3">
        <button
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            selectedNotebook === null
              ? 'bg-green-600 text-white'
              : 'text-gray-300 hover:bg-[#243D30]'
          }`}
          onClick={() => onSelectNotebook(null)}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>모든 메모</span>
        </button>
      </nav>

      {/* Notebooks header */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          노트북
        </span>
        <button
          onClick={() => setIsCreating(true)}
          className="text-gray-400 hover:text-white rounded p-0.5 transition-colors"
          title="노트북 추가"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* New notebook input */}
      {isCreating && (
        <div className="px-3 pb-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') { setIsCreating(false); setNewName(''); }
            }}
            placeholder="노트북 이름..."
            className="w-full bg-[#243D30] text-white text-sm px-3 py-1.5 rounded border border-[#3D6B50] focus:outline-none focus:border-green-400 placeholder-gray-500"
            autoFocus
          />
          <div className="flex gap-1.5 mt-1.5">
            <button
              onClick={handleCreate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded transition-colors"
            >
              만들기
            </button>
            <button
              onClick={() => { setIsCreating(false); setNewName(''); }}
              className="flex-1 bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white text-xs py-1 rounded transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Notebook list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {notebooks.map((nb) => (
          <div
            key={nb.id}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
              selectedNotebook === nb.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:bg-[#243D30]'
            }`}
            onClick={() => onSelectNotebook(nb.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="truncate">{nb.name}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-xs ${selectedNotebook === nb.id ? 'text-green-200' : 'text-gray-500'}`}>
                {nb.note_count}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`"${nb.name}" 노트북을 삭제하시겠습니까?\n(노트북 안의 메모는 삭제되지 않습니다)`)) {
                    onDeleteNotebook(nb.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-0.5 rounded transition-all"
                title="삭제"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {notebooks.length === 0 && !isCreating && (
          <p className="text-xs text-gray-500 px-3 py-2">
            노트북이 없습니다.
            <br />+ 버튼으로 추가하세요.
          </p>
        )}
      </div>
    </aside>
  );
}
