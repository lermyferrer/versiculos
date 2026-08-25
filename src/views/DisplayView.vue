<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logo from '../assets/logo.png'

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
    style="background: linear-gradient(160deg, #0a1a3f 0%, #04070f 65%, #000000 100%)"
  >
    <img :src="logo" alt="" class="absolute top-10 right-10 w-56 h-56 object-contain" />
    <div class="flex flex-col gap-6 max-w-5xl">
      <p v-for="v in verses" :key="v.number" class="text-5xl leading-relaxed text-center">
        <span class="text-slate-500 mr-3">[{{ v.number }}]</span>{{ v.text }}
      </p>
    </div>
    <p v-if="reference" class="text-3xl text-slate-400 mt-6">{{ reference }}</p>
  </main>
</template>
