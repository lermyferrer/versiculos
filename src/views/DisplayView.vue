<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import logo from '../assets/logo.png'
import { BACKGROUNDS } from '../assets/backgrounds'

const reference = ref('')
const version = ref('')
const verses = ref<{ number: number; text: string }[]>([])
const backgroundOn = ref(false)
const backgroundId = ref(BACKGROUNDS[0].id)

const showBackground = computed(() => verses.value.length > 0 || backgroundOn.value)
const backgroundSrc = computed(
  () => BACKGROUNDS.find((b) => b.id === backgroundId.value)?.src ?? BACKGROUNDS[0].src,
)

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
    class="relative min-h-screen text-white flex flex-col items-center justify-center p-16 gap-8 bg-cover bg-center"
    :style="{
      background: showBackground
        ? `radial-gradient(ellipse 1400px 520px at 50% -80px, rgba(147,197,253,0.30), transparent 70%), url(${backgroundSrc}) center/cover no-repeat`
        : 'transparent',
    }"
  >
    <div v-if="reference" class="absolute top-28 left-1/2 -translate-x-1/2 flex items-baseline gap-3">
      <span class="text-4xl font-semibold text-slate-400">{{ reference }}</span>
      <span class="text-4xl text-slate-400">{{ version }}</span>
    </div>
    <img v-if="showBackground" :src="logo" alt="" class="absolute top-10 right-10 w-56 h-56 object-contain" />
    <div class="flex flex-col gap-6 max-w-5xl">
      <p v-for="v in verses" :key="v.number" class="text-5xl leading-relaxed text-center">
        <span class="text-slate-400 mr-3">[{{ v.number }}]</span>{{ v.text }}
      </p>
    </div>
  </main>
</template>
