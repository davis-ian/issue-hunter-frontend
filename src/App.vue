<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Bell, Moon, RefreshCw, Search, Settings, Sun, UserRound } from 'lucide-vue-next'
import Button from '@/components/ui/button/UiButton.vue'
import Input from '@/components/ui/input/UiInput.vue'

const topSearch = ref('')
const issueCount = ref(0)
const lastRefresh = ref(new Date())
const isDark = ref(false)

const statusLabel = computed(() => {
  const delta = Math.round((Date.now() - lastRefresh.value.getTime()) / 60000)
  if (delta < 1) return 'SYNCED NOW'
  return `SYNCED ${delta}M AGO`
})

function triggerRefresh() {
  lastRefresh.value = new Date()
  window.dispatchEvent(new CustomEvent('issue-hunter-refresh'))
}

function triggerQuickSearch() {
  window.dispatchEvent(new CustomEvent('issue-hunter-search', { detail: topSearch.value }))
}

function onIssuesCount(event: Event) {
  const custom = event as CustomEvent<number>
  issueCount.value = Number(custom.detail ?? 0)
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    const target = event.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
    event.preventDefault()
    const input = document.getElementById('quick-search') as HTMLInputElement | null
    input?.focus()
  }
}

function applyTheme(nextDark: boolean) {
  document.documentElement.classList.toggle('dark', nextDark)
  localStorage.setItem('issue-hunter-theme', nextDark ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('issue-hunter-theme')
  isDark.value = savedTheme === 'dark'
  applyTheme(isDark.value)
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('issue-hunter-issues-count', onIssuesCount as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('issue-hunter-issues-count', onIssuesCount as EventListener)
})
</script>

<template>
  <div class="min-h-screen bg-[hsl(var(--ui-bg))]">
    <div
      class="mx-auto flex min-h-screen max-w-[1280px] flex-col overflow-hidden rounded-none bg-[hsl(var(--ui-shell))] text-[hsl(var(--ui-text))] shadow-[0_0_0_1px_hsl(var(--ui-border)),0_24px_80px_rgba(0,0,0,0.45)]"
    >
      <header class="flex flex-wrap items-center gap-3 border-b border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-header))] px-5 py-3">
      <p class="font-display text-2xl font-bold tracking-tight italic">ISSUE_TERMINAL_V1.0</p>
      <nav class="ml-0 flex gap-5 text-sm font-semibold uppercase tracking-wide md:ml-6">
        <RouterLink
          to="/issues"
          class="border-b-2 border-transparent pb-1 hover:border-[#ffc600]"
          active-class="border-[#ffc600]"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/searches"
          class="border-b-2 border-transparent pb-1 hover:border-[#ffc600]"
          active-class="border-[#ffc600]"
        >
          Search
        </RouterLink>
          <a class="pb-1 text-[hsl(var(--ui-muted))]">Sync</a>
          <a class="pb-1 text-[hsl(var(--ui-muted))]">Docs</a>
        </nav>
        <div class="ml-auto flex items-center gap-2">
        <div class="relative w-[280px] max-w-full">
          <Search
            class="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787878]"
          />
          <Input
            id="quick-search"
            v-model="topSearch"
            class="!border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-input))] pl-8"
            placeholder="CMD + K to search"
            @keydown.enter="triggerQuickSearch"
          />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
            class="!rounded-none !border !border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-header))]"
          ><Bell class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="icon-sm"
            class="!rounded-none !border !border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-header))]"
          ><Settings class="h-4 w-4"
        /></Button>
        <Button
          variant="ghost"
          size="icon-sm"
            class="!rounded-none !border !border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-header))]"
          ><UserRound class="h-4 w-4"
        /></Button>
          <Button
            variant="ghost"
            size="icon-sm"
            class="!rounded-none !border !border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-header))]"
            @click="toggleTheme"
          >
            <Moon v-if="!isDark" class="h-4 w-4" />
            <Sun v-else class="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div class="grid min-h-[720px] flex-1 grid-cols-1 pb-10 md:grid-cols-[220px_1fr]">
        <aside class="border-r border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-sidebar))]">
          <div class="border-b border-[hsl(var(--ui-border))] p-4">
            <div
              class="rounded-none border-2 border-[hsl(var(--ui-border))] bg-[#ffc600] px-3 py-2 font-mono text-xs font-semibold uppercase text-[#3e2e00]"
            >
            Local_DB
            <div class="text-[10px] text-[#444]">v2.4.0-stable</div>
          </div>
        </div>
        <nav class="space-y-1 p-3">
          <RouterLink
            to="/issues"
            class="block bg-transparent px-3 py-2 text-sm font-semibold"
            active-class="bg-[#ffc600]"
          >
            Issues
          </RouterLink>
          <RouterLink
            to="/searches"
            class="block bg-transparent px-3 py-2 text-sm font-semibold"
            active-class="bg-[#ffc600]"
          >
            Search Profiles
          </RouterLink>
        </nav>
        <div class="p-3">
          <Button class="w-full !rounded-none !border-2 !border-[hsl(var(--ui-border))]" @click="triggerRefresh">
            <RefreshCw class="h-4 w-4" />
            Sync Now
          </Button>
        </div>
      </aside>

      <main class="bg-[hsl(var(--ui-panel))] p-5">
        <RouterView />
      </main>
    </div>

      <footer class="fixed bottom-0 left-0 right-0 z-50 border-t border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-header))] font-mono text-[11px] uppercase tracking-widest text-[hsl(var(--ui-muted))]">
      <div class="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-2">
        <span>SYSTEM_READY // 2026</span>
        <span>STATUS: {{ statusLabel }} // ISSUES: {{ issueCount }}</span>
      </div>
    </footer>
    </div>
  </div>
</template>
