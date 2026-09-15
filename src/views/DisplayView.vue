<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import logo from '../assets/logo.png'
import { BACKGROUNDS } from '../assets/backgrounds'

const GLOW = 'radial-gradient(ellipse 1400px 520px at 50% -80px, rgba(147,197,253,0.30), transparent 70%)'
const ELEGANT_GRADIENT = 'linear-gradient(90deg, #0c1c40 0%, #0a172f 35%, #060a14 70%, #000000 100%)'

const reference = ref('')
const version = ref('')
const verses = ref<{ number: number; text: string }[]>([])
const backgroundOn = ref(true)
const backgroundId = ref(BACKGROUNDS[0].id)

const showBackground = computed(() => verses.value.length > 0 || backgroundOn.value)
const selectedBackground = computed(
  () => BACKGROUNDS.find((b) => b.id === backgroundId.value) ?? BACKGROUNDS[0],
)
const backgroundStyle = computed(() =>
  selectedBackground.value.kind === 'gradient'
    ? ELEGANT_GRADIENT
    : `${GLOW}, url(${selectedBackground.value.src}) center/cover no-repeat`,
)

const verseTextClass = computed(() => {
  const length = verses.value.reduce((sum, v) => sum + v.text.length, 0)
  if (length > 300) return 'text-7xl'
  if (length < 80) return 'text-8xl'
  return 'text-8xl'
})

onMounted(() => {
  window.api.onVerse((payload) => {
    reference.value = payload?.reference ?? ''
    version.value = payload?.version ?? ''
    verses.value = payload?.verses ?? []
  })
  window.api.onBackground((payload) => {
    backgroundOn.value = payload.visible
    backgroundId.value = payload.backgroundId
  })
})
</script>

<template>
  <main
    class="relative min-h-screen text-white flex flex-col items-center px-12 py-16 gap-8 bg-cover bg-center"
    :style="{ background: showBackground ? backgroundStyle : 'transparent' }"
  >
    <div v-if="reference" class="absolute top-42 text-center flex items-baseline gap-6">
      <span class="text-9xl font-semibold text-white uppercase">{{ reference }}</span>
      <span class="text-9xl font-semibold text-white">-</span>
      <span class="text-9xl font-semibold text-white">{{ version }}</span>
    </div>
    <img v-if="showBackground" :src="logo" alt="" class="absolute bottom-10 right-10 w-40 h-40 object-contain opacity-50" />
    <div class="flex flex-col gap-6 w-full max-w-[125rem] mt-90">
      <p v-for="v in verses" :key="v.number" :class="verseTextClass" class="leading-tight text-left">
        <span class="text-slate-400 mr-3">[{{ v.number }}]</span>{{ v.text }}
      </p>
    </div>
  </main>
</template>
