<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import logo from '../assets/logo.png'
import { BACKGROUNDS } from '../assets/backgrounds'

const GLOW = 'radial-gradient(ellipse 1400px 520px at 50% -80px, rgba(147,197,253,0.30), transparent 70%)'
const ELEGANT_GRADIENT = 'linear-gradient(90deg, #12295a 0%, #101f3e 35%, #080c18 70%, #000000 100%)'

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
  return length > 300 ? 'text-5xl' : 'text-6xl'
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
    class="relative min-h-screen text-white flex flex-col items-center p-16 gap-8 bg-cover bg-center"
    :style="{ background: showBackground ? backgroundStyle : 'transparent' }"
  >
    <div v-if="reference" class="absolute top-28 left-1/2 -translate-x-1/2 flex items-baseline gap-3">
      <span class="text-7xl font-semibold text-slate-400">{{ reference }}</span>
      <span class="text-7xl text-slate-400">{{ version }}</span>
    </div>
    <img v-if="showBackground" :src="logo" alt="" class="absolute bottom-10 right-10 w-32 h-32 object-contain opacity-70" />
    <div class="flex flex-col gap-6 max-w-7xl mt-72">
      <p v-for="v in verses" :key="v.number" :class="verseTextClass" class="leading-relaxed text-center">
        <span class="text-slate-400 mr-3">[{{ v.number }}]</span>{{ v.text }}
      </p>
    </div>
  </main>
</template>
