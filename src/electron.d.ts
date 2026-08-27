export interface VersePayload {
  reference: string
  version: string
  verses: { number: number; text: string }[]
}

declare global {
  interface Window {
    api: {
      sendVerse: (payload: VersePayload | null) => void
      onVerse: (callback: (payload: VersePayload | null) => void) => void
      closeApp: () => void
      setBackground: (payload: { visible: boolean; backgroundId: string }) => void
      onBackground: (callback: (payload: { visible: boolean; backgroundId: string }) => void) => void
    }
  }
}
