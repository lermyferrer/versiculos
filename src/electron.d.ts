export interface VersePayload {
  reference: string
  verses: { number: number; text: string }[]
}

declare global {
  interface Window {
    api: {
      sendVerse: (payload: VersePayload | null) => void
      onVerse: (callback: (payload: VersePayload | null) => void) => void
      closeApp: () => void
    }
  }
}
