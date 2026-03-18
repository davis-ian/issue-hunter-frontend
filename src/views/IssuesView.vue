<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { ExternalLink, LoaderCircle } from 'lucide-vue-next'
import { useIssues } from '@/composables/useIssues'
import Badge from '@/components/ui/badge/UiBadge.vue'
import Button from '@/components/ui/button/UiButton.vue'
import Input from '@/components/ui/input/UiInput.vue'

const { issues, total, pageNumber, search, maxPage, loading, error, fetchIssues, applySearch, nextPage, previousPage } =
  useIssues({ initialPageSize: 20 })

const filteredIssues = computed(() => {
  if (!search.value.trim()) {
    return issues.value
  }

  const q = search.value.trim().toLowerCase()
  return issues.value.filter((issue) => {
    const labels = issue.labels.toLowerCase()
    return issue.title.toLowerCase().includes(q) || issue.repository.toLowerCase().includes(q) || labels.includes(q)
  })
})

function formatDate(value: string) {
  const date = new Date(value)
  return Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

function labelList(labels: string) {
  return labels
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4)
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
  <section class="space-y-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
      <div>
        <h1 class="text-lg font-semibold">Issue Explorer</h1>
        <p class="text-sm text-muted-foreground">Browse deduplicated open-source opportunities from your active profiles.</p>
      </div>
      <div class="ml-auto flex w-full gap-2 md:w-auto">
        <Input v-model="search" placeholder="Filter current page..." class="md:w-72" @keydown.enter="applyFilters" />
        <Button variant="outline" @click="applyFilters">Apply</Button>
      </div>
    </div>

    <div v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="flex min-h-[280px] items-center justify-center gap-2 text-sm text-muted-foreground">
      <LoaderCircle class="h-4 w-4 animate-spin" />
      Loading issues...
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="issue in filteredIssues"
        :key="issue.id"
        class="rounded-lg border bg-card px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-sm"
      >
        <div class="flex flex-wrap items-center gap-2">
          <p class="font-medium">{{ issue.title }}</p>
          <Badge variant="outline">{{ issue.repository }} #{{ issue.issueNumber }}</Badge>
        </div>
        <div class="mt-2 flex flex-wrap gap-1">
          <Badge v-for="label in labelList(issue.labels)" :key="`${issue.id}-${label}`">{{ label }}</Badge>
          <Badge v-if="!labelList(issue.labels).length" variant="outline">No labels</Badge>
        </div>
        <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>Updated {{ formatDate(issue.githubUpdatedAt) }}</span>
          <a
            :href="issue.url"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1 text-foreground hover:underline"
          >
            Open on GitHub
            <ExternalLink class="h-3.5 w-3.5" />
          </a>
        </div>
      </article>

      <div v-if="!filteredIssues.length" class="rounded-md border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        No issues found for the current filter.
      </div>
    </div>

    <footer class="flex items-center justify-between border-t pt-3 text-sm">
      <p class="text-muted-foreground">Total {{ total }} issues</p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="pageNumber <= 0" @click="previousPage">Previous</Button>
        <span class="w-20 text-center text-xs text-muted-foreground">Page {{ pageNumber + 1 }}</span>
        <Button variant="outline" size="sm" :disabled="pageNumber >= maxPage" @click="nextPage">Next</Button>
      </div>
    </footer>
  </section>
</template>
