<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logo from '../assets/logo.png'

const VERSION = 'RV1960'

const reference = ref('')
const verses = ref<{ number: number; text: string }[]>([])

onMounted(() => {
  window.api.onVerse((payload) => {
    reference.value = payload?.reference ?? ''
    verses.value = payload?.verses ?? []
  })
})
</script>

<template>
  <main
    class="relative min-h-screen text-white flex flex-col items-center justify-center p-16 gap-8"
    style="background:
      radial-gradient(ellipse 1400px 520px at 50% -80px, rgba(147,197,253,0.30), transparent 70%),
      radial-gradient(ellipse at 15% 15%, rgba(96,165,250,0.12), transparent 60%),
      radial-gradient(ellipse at 85% 25%, rgba(59,130,246,0.09), transparent 55%),
      radial-gradient(ellipse at 50% 95%, rgba(37,99,235,0.11), transparent 60%),
      linear-gradient(160deg, #0d1830 0%, #070b18 55%, #020306 100%)"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
      style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.012%22 numOctaves=%225%22 seed=%227%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')"
    />
    <div v-if="reference" class="absolute top-28 left-1/2 -translate-x-1/2 flex items-baseline gap-3">
      <span class="text-4xl font-semibold text-slate-400">{{ reference }}</span>
      <span class="text-4xl text-slate-400">{{ VERSION }}</span>
    </div>
    <img :src="logo" alt="" class="absolute top-10 right-10 w-56 h-56 object-contain" />
    <div class="flex flex-col gap-6 max-w-5xl">
      <p v-for="v in verses" :key="v.number" class="text-5xl leading-relaxed text-center">
        <span class="text-slate-400 mr-3">[{{ v.number }}]</span>{{ v.text }}
      </p>
    </div>
  </main>
</template>
