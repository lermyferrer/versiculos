const BASE = 'https://bolls.life'

export type TranslationCode = 'RV1960' | 'NTV'

export interface Translation {
  code: TranslationCode
  label: string
}

export const TRANSLATIONS: Translation[] = [
  { code: 'RV1960', label: 'Reina-Valera 1960' },
  { code: 'NTV', label: 'Nueva Traducción Viviente' },
]

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

export async function fetchBooks(translation: TranslationCode): Promise<Book[]> {
  const res = await fetch(`${BASE}/get-books/${translation}/`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de libros')
  return res.json()
}

export async function fetchChapter(
  translation: TranslationCode,
  bookId: number,
  chapter: number,
): Promise<Verse[]> {
  const res = await fetch(`${BASE}/get-text/${translation}/${bookId}/${chapter}/`)
  if (!res.ok) throw new Error('No se pudo cargar el capítulo')
  return res.json()
}

export interface SearchResult {
  pk: number
  book: number
  chapter: number
  verse: number
  text: string
}

// Búsqueda de texto en toda la Biblia (no solo el capítulo/libro elegido).
export async function searchText(translation: TranslationCode, query: string): Promise<SearchResult[]> {
  const res = await fetch(`${BASE}/v2/find/${translation}?search=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('No se pudo buscar')
  const data = await res.json()
  return data.results
}
