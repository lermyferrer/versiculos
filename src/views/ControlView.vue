<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { fetchBooks, fetchChapter, searchText, TRANSLATIONS, type Book, type Verse, type SearchResult } from '../services/bolls'
import { BACKGROUNDS } from '../assets/backgrounds'

const translation = ref(TRANSLATIONS[0].code)
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
const bookName = (id: number) => books.value.find((b) => b.bookid === id)?.name ?? ''

async function loadBooks() {
  error.value = ''
  try {
    books.value = await fetchBooks(translation.value)
  } catch (e) {
    error.value = (e as Error).message
  }
}

onMounted(loadBooks)

watch(translation, () => {
  bookId.value = undefined
  loadBooks()
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
    verses.value = await fetchChapter(translation.value, bookId.value, chapter.value)
  } catch (e) {
    error.value = (e as Error).message
  }
})

// Búsqueda de texto en toda la Biblia (bolls.life /v2/find), con debounce simple.
const textSearch = ref('')
const textSearchResults = ref<SearchResult[]>([])
const searchingText = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(textSearch, (q) => {
  clearTimeout(searchTimer)
  if (q.trim().length < 3) {
    textSearchResults.value = []
    return
  }
  searchTimer = setTimeout(async () => {
    searchingText.value = true
    error.value = ''
    try {
      textSearchResults.value = await searchText(translation.value, q.trim())
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      searchingText.value = false
    }
  }, 400)
})

async function selectSearchResult(result: SearchResult) {
  const chosen = await fetchChapter(translation.value, result.book, result.chapter)
  textSearch.value = ''
  textSearchResults.value = []
  bookId.value = result.book
  await nextTick()
  chapter.value = result.chapter
  await nextTick()
  verses.value = chosen
  selectedVerses.value = [result.verse]
}

const MAX_VERSES = 1;

function toggleVerse(v: number) {
  const i = selectedVerses.value.indexOf(v)
  if (i !== -1) {
    selectedVerses.value.splice(i, 1)
    return
  }
  while (selectedVerses.value.length >= MAX_VERSES) {
    selectedVerses.value.shift()
  }
  selectedVerses.value.push(v)
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

const isShowingVerse = ref(false)

const chosenVerses = computed(() =>
  [...selectedVerses.value]
    .sort((a, b) => a - b)
    .map((v) => verses.value.find((verse) => verse.verse === v))
    .filter((v): v is Verse => !!v),
)
const previewReference = computed(
  () => `${selectedBook.value?.name} ${chapter.value}:${formatRanges([...selectedVerses.value].sort((a, b) => a - b))}`,
)

watch(chosenVerses, (chosen) => {
  if (!chosen.length) {
    window.api.sendVerse(null)
    isShowingVerse.value = false
    return
  }
  window.api.sendVerse({
    reference: previewReference.value,
    version: translation.value,
    verses: chosen.map((v) => ({ number: v.verse, text: v.text.replace(/<[^>]+>/g, '') })),
  })
  isShowingVerse.value = true
})

function hide() {
  selectedVerses.value = []
}

function closeApp() {
  window.api.closeApp()
}

const backgroundOn = ref(true)
const backgroundId = ref(BACKGROUNDS[0].id)

function syncBackground() {
  window.api.setBackground({ visible: backgroundOn.value, backgroundId: backgroundId.value })
}

function toggleBackground() {
  backgroundOn.value = !backgroundOn.value
  syncBackground()
}

watch(backgroundId, syncBackground)
</script>

<template>
  <main class="h-screen overflow-y-auto bg-slate-900 text-white p-6 flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Versículos — Control</h1>
      <div class="flex gap-3">
        <select v-model="backgroundId" class="bg-slate-800 rounded px-3 py-2">
          <option v-for="b in BACKGROUNDS" :key="b.id" :value="b.id">{{ b.label }}</option>
        </select>
        <button
          v-if="!isShowingVerse"
          type="button"
          @click="toggleBackground"
          class="rounded px-4 py-2"
          :class="backgroundOn ? 'bg-blue-700 hover:bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'"
        >
          Fondo: {{ backgroundOn ? 'visible' : 'oculto' }}
        </button>
        <span v-else class="text-sm text-slate-400 self-center">Ocultá el versículo para mostrar/ocultar el fondo</span>
        <button
          v-if="selectedVerses.length"
          type="button"
          @click="hide"
          class="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2"
        >
          Ocultar
        </button>
        <button type="button" @click="closeApp" class="bg-red-700 hover:bg-red-600 rounded px-4 py-2">Cerrar</button>
      </div>
    </div>

    <label class="flex flex-col gap-1">
      Buscar por texto (en toda la Biblia)
      <input
        v-model="textSearch"
        type="text"
        placeholder="Ej. amor, gracia, salvación..."
        class="bg-slate-800 rounded px-3 py-2 w-full"
      />
    </label>

    <div v-if="textSearch.trim().length >= 3" class="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2">
      <p v-if="searchingText" class="text-sm text-slate-400">Buscando...</p>
      <p v-else-if="!textSearchResults.length" class="text-sm text-slate-400">Sin resultados.</p>
      <button
        v-for="r in textSearchResults.slice(0, 200)"
        :key="r.pk"
        type="button"
        @click="selectSearchResult(r)"
        class="text-left rounded px-3 py-2 bg-slate-800 hover:bg-slate-700"
      >
        <span class="text-slate-400 mr-2">{{ bookName(r.book) }} {{ r.chapter }}:{{ r.verse }}</span
        >{{ r.text.replace(/<[^>]+>/g, '') }}
      </button>
      <p v-if="textSearchResults.length > 200" class="text-xs text-slate-500">
        Mostrando los primeros 200 de {{ textSearchResults.length }} resultados — afiná la búsqueda.
      </p>
    </div>

    <div class="flex gap-3 items-end flex-wrap">
      <label class="flex flex-col gap-1">
        Buscar libro
        <input
          v-model="search"
          type="text"
          placeholder="Ej. Juan"
          class="bg-slate-800 rounded px-3 py-2 w-64"
        />
      </label>
      <label class="flex flex-col gap-1">
        Versión
        <select v-model="translation" class="bg-slate-800 rounded px-3 py-2 w-48">
          <option v-for="t in TRANSLATIONS" :key="t.code" :value="t.code">{{ t.label }}</option>
        </select>
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
      Tocá un versículo para mostrarlo (tocar otro lo reemplaza).
    </p>

    <div class="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto pr-2">
      <button
        v-for="v in verses"
        :key="v.pk"
        type="button"
        @click="toggleVerse(v.verse)"
        class="text-left rounded px-3 py-2"
        :class="
          selectedVerses.includes(v.verse) ? 'bg-blue-700 font-bold' : 'bg-slate-800 hover:bg-slate-700'
        "
      >
        <span class="text-slate-400 mr-2">{{ v.verse }}</span>{{ v.text.replace(/<[^>]+>/g, '') }}
      </button>
    </div>
  </main>
</template>
