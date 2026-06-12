'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import NoteList from '@/components/NoteList';
import NoteEditor from '@/components/NoteEditor';

interface Notebook {
  id: number;
  name: string;
  created_at: string;
  note_count: number;
}

interface Note {
  id: number;
  notebook_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotebooks = async () => {
    const res = await fetch('/api/notebooks');
    const data = await res.json();
    setNotebooks(data);
  };

  const fetchNotes = useCallback(async (notebookId: number | null = null) => {
    const url = notebookId ? `/api/notes?notebook_id=${notebookId}` : '/api/notes';
    const res = await fetch(url);
    const data = await res.json();
    setNotes(data);
  }, []);

  useEffect(() => {
    fetchNotebooks();
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNotebook = (id: number | null) => {
    setSelectedNotebook(id);
    setSelectedNote(null);
    setSearchQuery('');
    fetchNotes(id);
  };

  const handleCreateNote = async () => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '제목 없음',
        content: '',
        notebook_id: selectedNotebook,
      }),
    });
    const note = await res.json();
    await fetchNotes(selectedNotebook);
    await fetchNotebooks();
    setSelectedNote(note);
  };

  const handleUpdateNote = useCallback(
    async (id: number, updates: Partial<Note>) => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
      updateTimerRef.current = setTimeout(async () => {
        await fetch(`/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        await fetchNotes(selectedNotebook);
      }, 800);
    },
    [selectedNotebook, fetchNotes]
  );

  const handleDeleteNote = async (id: number) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setSelectedNote(null);
    await fetchNotes(selectedNotebook);
    await fetchNotebooks();
  };

  const handleCreateNotebook = async (name: string) => {
    await fetch('/api/notebooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    await fetchNotebooks();
  };

  const handleDeleteNotebook = async (id: number) => {
    await fetch(`/api/notebooks/${id}`, { method: 'DELETE' });
    if (selectedNotebook === id) {
      setSelectedNotebook(null);
      await fetchNotes(null);
    }
    await fetchNotebooks();
  };

  const filteredNotes = searchQuery
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        onSelectNotebook={handleSelectNotebook}
        onCreateNotebook={handleCreateNotebook}
        onDeleteNotebook={handleDeleteNotebook}
      />
      <NoteList
        notes={filteredNotes}
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
        onCreateNote={handleCreateNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notebookName={
          selectedNotebook
            ? notebooks.find((n) => n.id === selectedNotebook)?.name
            : '모든 메모'
        }
      />
      <NoteEditor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
