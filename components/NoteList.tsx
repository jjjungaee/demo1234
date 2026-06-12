'use client';

interface Note {
  id: number;
  notebook_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notebookName?: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function getPreview(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

export default function NoteList({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
  notebookName,
}: NoteListProps) {
  return (
    <div className="w-72 bg-[#F5F4EF] border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-semibold text-gray-800 text-sm truncate">
            {notebookName || '모든 메모'}
          </h2>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{notes.length}개</span>
        </div>
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-2.5 top-2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="메모 검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-md text-xs focus:outline-none focus:border-green-400 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* New note button */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 메모
        </button>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">
              {searchQuery ? '검색 결과가 없습니다' : '메모가 없습니다'}
            </p>
            {!searchQuery && (
              <p className="text-xs mt-1 text-gray-300">새 메모 버튼으로 시작하세요</p>
            )}
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedNote?.id === note.id
                  ? 'bg-white border-l-2 border-l-green-500'
                  : 'hover:bg-[#ECEAE3] border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-1 gap-2">
                <h3 className="font-medium text-gray-800 text-sm leading-tight truncate flex-1">
                  {note.title || '제목 없음'}
                </h3>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                  {formatDate(note.updated_at)}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {getPreview(note.content) || '내용 없음'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
