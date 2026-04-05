import { reactive, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

type ToastItem = { id: number; message: string; type: ToastType }

const state = reactive({
  items: [] as ToastItem[]
})

let seq = 0
const DEFAULT_DURATION_MS = 3000

function remove(id: number) {
  const i = state.items.findIndex((t) => t.id === id)
  if (i >= 0) state.items.splice(i, 1)
}

export function notify(message: string, type: ToastType = 'info', durationMs = DEFAULT_DURATION_MS) {
  const id = ++seq
  state.items.push({ id, message, type })
  if (durationMs > 0) {
    setTimeout(() => remove(id), durationMs)
  }
}

export function notifySuccess(message: string, durationMs?: number) {
  notify(message, 'success', durationMs ?? DEFAULT_DURATION_MS)
}

export function notifyError(message: string, durationMs?: number) {
  notify(message, 'error', durationMs ?? DEFAULT_DURATION_MS)
}

export function dismissNotify(id: number) {
  remove(id)
}

export const toastState = readonly(state)

export function messageFromCaught(error: unknown): string {
  let raw: string
  if (error instanceof Error) {
    raw = error.message
  } else if (error != null && typeof error === 'object' && 'message' in error) {
    const m = (error as { message: unknown }).message
    raw = typeof m === 'string' ? m : String(error)
  } else {
    raw = String(error)
  }
  return raw.replace(/^Error:\s*/, '').trim()
}
