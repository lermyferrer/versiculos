<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { fetchBooks, fetchChapter, type Book, type Verse } from '../services/bolls'

const books = ref<Book[]>([])
const search = ref('')
const bookId = ref<number>()
const chapter = ref<number>()
const verses = ref<Verse[]>([])
const selectedVerses = ref<number[]>([])
const error = ref('')

const filteredBooks = computed(() =>
  books.value.filter((b) => b.name.toLowerCase().includes(search.value.toLowerCase())),
)
const selectedBook = computed(() => books.value.find((b) => b.bookid === bookId.value))

onMounted(async () => {
  try {
    books.value = await fetchBooks()
  } catch (e) {
    error.value = (e as Error).message
  }
})

watch(bookId, () => {
  chapter.value = undefined
  verses.value = []
  selectedVerses.value = []
})

watch(chapter, async () => {
  selectedVerses.value = []
  verses.value = []
  if (!bookId.value || !chapter.value) return
  error.value = ''
  try {
    verses.value = await fetchChapter(bookId.value, chapter.value)
  } catch (e) {
    error.value = (e as Error).message
  }
})

const MAX_VERSES = 3

function toggleVerse(v: number) {
  const i = selectedVerses.value.indexOf(v)
  if (i === -1) {
    if (selectedVerses.value.length >= MAX_VERSES) return
    selectedVerses.value.push(v)
  } else {
    selectedVerses.value.splice(i, 1)
  }
}

// Agrupa números consecutivos ("16,17,18,20" -> "16-18,20") para la referencia.
function formatRanges(nums: number[]) {
  const sorted = [...nums].sort((a, b) => a - b)
  const parts: string[] = []
  let start = sorted[0]
  let prev = sorted[0]
  for (let i = 1; i <= sorted.length; i++) {
    const n = sorted[i]
    if (n === prev + 1) {
      prev = n
      continue
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`)
    start = n
    prev = n
  }
  return parts.join(',')
}

function show() {
  const sorted = [...selectedVerses.value].sort((a, b) => a - b)
  const chosen = sorted
    .map((v) => verses.value.find((verse) => verse.verse === v))
    .filter((v): v is Verse => !!v)
  if (!chosen.length) return
  window.api.sendVerse({
    reference: `${selectedBook.value?.name} ${chapter.value}:${formatRanges(sorted)}`,
    verses: chosen.map((v) => ({ number: v.verse, text: v.text.replace(/<[^>]+>/g, '') })),
  })
}

function hide() {
  selectedVerses.value = []
  window.api.sendVerse(null)
}

function closeApp() {
  window.api.closeApp()
}
</script>

<template>
  <main class="min-h-screen bg-slate-900 text-white p-6 flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Versículos — Control</h1>
      <button type="button" @click="closeApp" class="bg-red-700 hover:bg-red-600 rounded px-4 py-2">Cerrar</button>
    </div>

    <div class="flex gap-3 items-end flex-wrap">
      <label class="flex flex-col gap-1">
        Buscar libro
        <input
          v-model="search"
          type="text"
          placeholder="Ej. Juan"
          class="bg-slate-800 rounded px-3 py-2 w-48"
        />
      </label>
      <label class="flex flex-col gap-1">
        Libro
        <select v-model.number="bookId" class="bg-slate-800 rounded px-3 py-2 w-48">
          <option :value="undefined" disabled>Seleccioná un libro</option>
          <option v-for="b in filteredBooks" :key="b.bookid" :value="b.bookid">{{ b.name }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1">
        Capítulo
        <select v-model.number="chapter" :disabled="!selectedBook" class="bg-slate-800 rounded px-3 py-2 w-28">
          <option :value="undefined" disabled>—</option>
          <option v-for="c in selectedBook?.chapters ?? 0" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
    </div>

    <p v-if="error" class="text-red-400">{{ error }}</p>

    <p v-if="verses.length" class="text-sm text-slate-400">
      Elegí hasta {{ MAX_VERSES }} versículos para presentarlos juntos.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="v in verses"
        :key="v.pk"
        type="button"
        @click="toggleVerse(v.verse)"
        :disabled="!selectedVerses.includes(v.verse) && selectedVerses.length >= MAX_VERSES"
        class="rounded px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        :class="selectedVerses.includes(v.verse) ? 'bg-blue-700' : 'bg-slate-800 hover:bg-slate-700'"
      >
        {{ v.verse }}
      </button>
    </div>

    <div v-if="selectedVerses.length" class="flex gap-3">
      <button type="button" @click="show" class="bg-blue-600 hover:bg-blue-500 rounded px-4 py-2">
        Mostrar ({{ selectedVerses.length }})
      </button>
      <button type="button" @click="hide" class="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2">Ocultar</button>
    </div>
  </main>
</template>
