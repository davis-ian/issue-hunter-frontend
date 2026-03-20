<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { ExternalLink, LoaderCircle } from 'lucide-vue-next'
import { useIssues } from '@/composables/useIssues'
import Button from '@/components/ui/button/UiButton.vue'
import Input from '@/components/ui/input/UiInput.vue'

const { issues, total, pageNumber, search, maxPage, loading, error, fetchIssues, applySearch, nextPage, previousPage } =
  useIssues({ initialPageSize: 20 })

const filteredIssues = computed(() => {
  if (!search.value.trim()) return issues.value
  const q = search.value.trim().toLowerCase()
  return issues.value.filter((issue) => {
    const labels = issue.labels.toLowerCase()
    return issue.title.toLowerCase().includes(q) || issue.repository.toLowerCase().includes(q) || labels.includes(q)
  })
})

const unresolvedCount = computed(() => filteredIssues.value.filter((i) => i.state.toLowerCase() === 'open').length)
const avgAgeHours = computed(() => {
  if (!filteredIssues.value.length) return 0
  const now = Date.now()
  const totalHours = filteredIssues.value.reduce((acc, issue) => {
    const age = (now - new Date(issue.githubCreatedAt).getTime()) / 1000 / 60 / 60
    return acc + age
  }, 0)
  return (totalHours / filteredIssues.value.length).toFixed(1)
})

function formatDate(value: string) {
  return Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(value))
}

function labelList(labels: string) {
  return labels
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 3)
}

function onRefresh() {
  void fetchIssues()
}

function onQuickSearch(event: Event) {
  const customEvent = event as CustomEvent<string>
  void applySearch(customEvent.detail ?? '')
}

function applyFilters() {
  void applySearch()
}

watch(total, (value) => {
  window.dispatchEvent(new CustomEvent('issue-hunter-issues-count', { detail: value }))
})

onMounted(() => {
  window.addEventListener('issue-hunter-refresh', onRefresh)
  window.addEventListener('issue-hunter-search', onQuickSearch as EventListener)
  void fetchIssues()
})

onUnmounted(() => {
  window.removeEventListener('issue-hunter-refresh', onRefresh)
  window.removeEventListener('issue-hunter-search', onQuickSearch as EventListener)
})
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--ui-muted))]">System Overlord / User-042</p>
        <h1 class="font-display text-6xl font-bold uppercase leading-none tracking-tight text-[hsl(var(--ui-text))]">
          Dashboard<span class="text-[#ffc600]">.SH</span>
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-[hsl(var(--ui-muted))]">Operational overview of local repository issues. All systems within nominal synchronization parameters.</p>
      </div>
      <div class="flex gap-2">
        <Input v-model="search" class="!h-11 !w-[280px] !border !border-[hsl(var(--ui-border))] !bg-[hsl(var(--ui-input))]" placeholder="Filter feed" @keydown.enter="applyFilters" />
        <Button variant="tertiary" class="!h-11 !rounded-none !border-2 !border-[hsl(var(--ui-border))] !text-[hsl(var(--ui-text))]" @click="applyFilters">Filter Feed</Button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--ui-muted))]">Total Synced</p>
        <p class="mt-3 text-5xl font-bold leading-none">{{ total }}</p>
      </div>
      <div class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--ui-muted))]">Unresolved</p>
        <p class="mt-3 text-5xl font-bold leading-none text-[#c02424]">{{ unresolvedCount }}</p>
      </div>
      <div class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--ui-muted))]">Last Sync Status</p>
        <p class="mt-3 text-2xl font-semibold leading-none">Operational</p>
      </div>
      <div class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--ui-muted))]">Avg Response</p>
        <p class="mt-3 text-5xl font-bold leading-none">{{ avgAgeHours }}</p>
      </div>
    </div>

    <div v-if="error" class="border-2 border-[#b91c1c] bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]">
      {{ error }}
    </div>

    <div class="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-display text-3xl uppercase tracking-tight">Recent_Activity<span class="text-[#ffc600]">_log</span></h2>
          <div class="font-mono text-xs uppercase text-[hsl(var(--ui-muted))]">Page {{ pageNumber + 1 }}</div>
        </div>

        <div v-if="loading" class="flex min-h-[260px] items-center justify-center gap-3 border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))]">
          <LoaderCircle class="h-5 w-5 animate-spin text-[hsl(var(--ui-text))]" />
          <span class="font-mono text-xs uppercase">Loading entries...</span>
        </div>

        <div v-else-if="filteredIssues.length" class="space-y-3">
          <article v-for="issue in filteredIssues" :key="issue.id" class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_hsl(var(--ui-border))]">
            <div class="mb-2 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="mb-1 flex flex-wrap items-center gap-2">
                  <span class="bg-[#ffc600] px-2 py-0.5 font-mono text-[11px] font-semibold">#{{ issue.issueNumber }}</span>
                  <span class="font-mono text-[11px] uppercase text-[hsl(var(--ui-muted))]">{{ formatDate(issue.githubUpdatedAt) }}</span>
                  <span class="border border-[hsl(var(--ui-border))] px-2 py-0.5 font-mono text-[10px] uppercase">{{ issue.repository }}</span>
                </div>
                <h3 class="line-clamp-2 text-2xl font-semibold leading-tight">{{ issue.title }}</h3>
              </div>
              <a :href="issue.url" target="_blank" rel="noreferrer" class="border border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-input))] p-1 hover:bg-[#ffc600]">
                <ExternalLink class="h-4 w-4" />
              </a>
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-for="label in labelList(issue.labels)" :key="`${issue.id}-${label}`" class="border border-[hsl(var(--ui-border))] px-2 py-0.5 font-mono text-[10px] uppercase">
                {{ label }}
              </span>
            </div>
          </article>
        </div>

        <div v-else class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-10 text-center font-mono text-xs uppercase text-[hsl(var(--ui-muted))]">
          No issues found for current filter
        </div>

        <div class="mt-4 flex items-center justify-between">
          <Button variant="tertiary" class="!rounded-none !border-2 !border-[hsl(var(--ui-border))] !text-[hsl(var(--ui-text))]" :disabled="pageNumber <= 0" @click="previousPage">Prev</Button>
          <Button variant="tertiary" class="!rounded-none !border-2 !border-[hsl(var(--ui-border))] !text-[hsl(var(--ui-text))]" :disabled="pageNumber >= maxPage" @click="nextPage">Next</Button>
        </div>
      </div>

      <aside class="space-y-3">
        <div class="border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-4 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
          <p class="font-mono text-xs uppercase tracking-[0.2em]">Terminal_Filters</p>
          <div class="mt-3 space-y-2">
            <div class="flex items-center justify-between bg-[#ffc600] px-3 py-2 text-sm font-semibold">
              <span>My Issues</span>
              <span>{{ unresolvedCount }}</span>
            </div>
            <div class="flex items-center justify-between border border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-input))] px-3 py-2 text-sm">
              <span>Needs Review</span>
              <span>{{ Math.max(0, unresolvedCount - 2) }}</span>
            </div>
            <div class="flex items-center justify-between border border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-input))] px-3 py-2 text-sm">
              <span>Critical</span>
              <span>{{ Math.min(4, unresolvedCount) }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
