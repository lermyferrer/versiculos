const BASE = 'https://bolls.life'
const TRANSLATION = 'RV1960'

export interface Book {
  bookid: number
  name: string
  chapters: number
}

export interface Verse {
  pk: number
  verse: number
  text: string
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE}/get-books/${TRANSLATION}/`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de libros')
  return res.json()
}

export async function fetchChapter(bookId: number, chapter: number): Promise<Verse[]> {
  const res = await fetch(`${BASE}/get-text/${TRANSLATION}/${bookId}/${chapter}/`)
  if (!res.ok) throw new Error('No se pudo cargar el capítulo')
  return res.json()
}
