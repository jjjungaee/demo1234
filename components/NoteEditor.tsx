'use client';

import { useState, useEffect, useRef } from 'react';

interface Note {
  id: number;
  notebook_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: number, updates: Partial<Note>) => void;
  onDeleteNote: (id: number) => void;
}

function ToolbarBtn({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`h-7 min-w-[28px] px-1.5 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? 'bg-green-100 text-green-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

export default function NoteEditor({ note, onUpdateNote, onDeleteNote }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevNoteIdRef = useRef<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!note) return;

    setTitle(note.title);

    if (note.id !== prevNoteIdRef.current) {
      if (contentRef.current) {
        contentRef.current.innerHTML = note.content || '';
      }
      prevNoteIdRef.current = note.id;
    }
  }, [note]);

  const scheduleUpdate = (updates: Partial<Note>) => {
    if (!note) return;
    setSaving(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      onUpdateNote(note.id, updates);
      setSaving(false);
    }, 800);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    scheduleUpdate({ title: val });
  };

  const handleContentInput = () => {
    if (contentRef.current) {
      scheduleUpdate({ content: contentRef.current.innerHTML });
    }
  };

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    contentRef.current?.focus();
    handleContentInput();
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-300">
          <svg className="w-20 h-20 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-400 text-base">메모를 선택하거나 새로 만드세요</p>
        </div>
      </div>
    );
  }

  const updatedAt = new Date(note.updated_at + (note.updated_at.endsWith('Z') ? '' : 'Z'));

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Toolbar */}
      <div className="border-b border-gray-100 px-4 py-1.5 flex items-center gap-0.5 bg-gray-50 flex-shrink-0">
        <ToolbarBtn onClick={() => exec('bold')} title="굵게 (Ctrl+B)">
          <strong className="font-bold text-sm">B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="기울임 (Ctrl+I)">
          <em className="italic text-sm">I</em>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="밑줄 (Ctrl+U)">
          <u className="text-sm">U</u>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('strikeThrough')} title="취소선">
          <s className="text-sm">S</s>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="제목 1">
          <span className="text-xs font-semibold">H1</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="제목 2">
          <span className="text-xs font-semibold">H2</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'p')} title="본문">
          <span className="text-xs">¶</span>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="글머리 기호">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="번호 매기기">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'blockquote')} title="인용구">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => exec('removeFormat')} title="서식 초기화">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ToolbarBtn>

        <div className="flex-1" />

        {/* Saving indicator */}
        {saving && (
          <span className="text-xs text-gray-400 mr-2">저장 중...</span>
        )}

        {/* Delete */}
        <button
          onClick={() => {
            if (confirm('이 메모를 삭제하시겠습니까?')) {
              onDeleteNote(note.id);
            }
          }}
          className="h-7 px-2 flex items-center gap-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors text-xs"
          title="메모 삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          삭제
        </button>
      </div>

      {/* Title + meta */}
      <div className="px-10 pt-8 pb-3 flex-shrink-0">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목"
          className="w-full text-2xl font-bold text-gray-900 focus:outline-none placeholder-gray-200 bg-transparent"
        />
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span>
            {updatedAt.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            {updatedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 수정됨
          </span>
        </div>
        <div className="mt-4 border-b border-gray-100" />
      </div>

      {/* Content editor */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleContentInput}
        data-placeholder="메모 내용을 입력하세요..."
        className="flex-1 px-10 py-4 focus:outline-none text-gray-700 text-sm leading-relaxed overflow-y-auto note-content"
        suppressContentEditableWarning
      />
    </div>
  );
}
