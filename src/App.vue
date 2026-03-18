<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Search, RefreshCw } from 'lucide-vue-next'
import Button from '@/components/ui/button/UiButton.vue'
import Input from '@/components/ui/input/UiInput.vue'

const topSearch = ref('')

function triggerRefresh() {
  window.dispatchEvent(new CustomEvent('issue-hunter-refresh'))
}

function triggerQuickSearch() {
  window.dispatchEvent(new CustomEvent('issue-hunter-search', { detail: topSearch.value }))
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    const target = event.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
      return
    }

    event.preventDefault()
    const input = document.getElementById('quick-search') as HTMLInputElement | null
    input?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-[1400px] animate-fade-in flex-col p-4 md:p-6">
    <header class="panel sticky top-4 z-40 mb-4 flex items-center gap-3 px-4 py-3 backdrop-blur">
      <RouterLink to="/issues" class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-semibold">IH</div>
        <div>
          <p class="text-sm font-semibold leading-none">IssueHunter</p>
          <p class="text-xs text-muted-foreground">Open source issue radar</p>
        </div>
      </RouterLink>

      <div class="relative ml-auto hidden w-full max-w-md md:block">
        <Search class="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="quick-search"
          v-model="topSearch"
          placeholder="Quick filter... ( / )"
          class="pl-8"
          @keydown.enter="triggerQuickSearch"
        />
      </div>

      <Button variant="outline" size="sm" @click="triggerRefresh">
        <RefreshCw class="h-4 w-4" />
        Refresh
      </Button>
    </header>

    <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
      <aside class="panel h-fit p-3">
        <p class="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>
        <nav class="space-y-1">
          <RouterLink
            to="/issues"
            class="block rounded-md px-2 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            active-class="bg-accent text-foreground"
          >
            Issues
          </RouterLink>
          <RouterLink
            to="/searches"
            class="block rounded-md px-2 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            active-class="bg-accent text-foreground"
          >
            Search Profiles
          </RouterLink>
        </nav>
      </aside>

      <main class="panel min-h-[70vh] p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
