<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LoaderCircle, Plus } from 'lucide-vue-next'
import { useSearches } from '@/composables/useSearches'
import type { SearchProfile, SearchProfilePayload } from '@/types/search'
import Badge from '@/components/ui/badge/UiBadge.vue'
import Button from '@/components/ui/button/UiButton.vue'
import Input from '@/components/ui/input/UiInput.vue'

type FormState = SearchProfilePayload

const { profiles, loading, error, saving, validationErrors, fetchSearches, saveSearch } = useSearches()
const dialogOpen = ref(false)
const editingId = ref<number | null>(null)

const form = ref<FormState>({
  name: '',
  description: '',
  labels: '',
  languages: '',
  query: '',
  intervalMinutes: 60,
  enabled: true,
  priority: 0,
})

const dialogTitle = computed(() => (editingId.value ? 'Edit Search Profile' : 'Create Search Profile'))

function formatRelative(value?: string | null) {
  if (!value) {
    return 'Not scheduled'
  }

  const now = Date.now()
  const then = new Date(value).getTime()
  const deltaMinutes = Math.round((then - now) / (1000 * 60))

  if (Math.abs(deltaMinutes) < 1) {
    return 'Now'
  }

  if (deltaMinutes > 0) {
    return `In ${deltaMinutes}m`
  }

  return `${Math.abs(deltaMinutes)}m ago`
}

function toPayload(): SearchProfilePayload {
  return {
    ...form.value,
    intervalMinutes: Number(form.value.intervalMinutes),
    priority: Number(form.value.priority),
  }
}

function resetForm() {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    labels: '',
    languages: '',
    query: '',
    intervalMinutes: 60,
    enabled: true,
    priority: 0,
  }
}

function startCreate() {
  resetForm()
  dialogOpen.value = true
}

function startEdit(profile: SearchProfile) {
  editingId.value = profile.id
  form.value = {
    name: profile.name,
    description: profile.description,
    labels: profile.labels,
    languages: profile.languages,
    query: profile.query,
    intervalMinutes: profile.intervalMinutes,
    enabled: profile.enabled,
    priority: profile.priority,
  }
  dialogOpen.value = true
}

async function submit() {
  try {
    const payload = toPayload()
    await saveSearch(payload, editingId.value ?? undefined)

    dialogOpen.value = false
    resetForm()
  } catch {
    // Error state is handled by composable.
  }
}

onMounted(() => {
  void fetchSearches()
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center">
      <div>
        <h1 class="text-lg font-semibold">Search Profiles</h1>
        <p class="text-sm text-muted-foreground">Tune which GitHub streams feed the issue explorer.</p>
      </div>
      <Button class="ml-auto" @click="startCreate">
        <Plus class="h-4 w-4" />
        New Profile
      </Button>
    </div>

    <div v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="flex min-h-[240px] items-center justify-center gap-2 text-sm text-muted-foreground">
      <LoaderCircle class="h-4 w-4 animate-spin" />
      Loading profiles...
    </div>

    <div v-else class="grid gap-3">
      <article v-for="profile in profiles" :key="profile.id" class="rounded-lg border bg-card p-4">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="font-medium">{{ profile.name }}</h2>
          <Badge :variant="profile.enabled ? 'success' : 'outline'">{{ profile.enabled ? 'Enabled' : 'Disabled' }}</Badge>
          <Badge variant="outline">Priority {{ profile.priority }}</Badge>
          <Button variant="ghost" size="sm" class="ml-auto" @click="startEdit(profile)">Edit</Button>
        </div>
        <p v-if="profile.description" class="mt-2 text-sm text-muted-foreground">{{ profile.description }}</p>
        <div class="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
          <p><span class="font-medium text-foreground">Labels:</span> {{ profile.labels || 'None' }}</p>
          <p><span class="font-medium text-foreground">Languages:</span> {{ profile.languages || 'Any' }}</p>
          <p><span class="font-medium text-foreground">Interval:</span> every {{ profile.intervalMinutes }} minutes</p>
          <p><span class="font-medium text-foreground">Next:</span> {{ formatRelative(profile.nextRunAfter) }}</p>
          <p><span class="font-medium text-foreground">Last result count:</span> {{ profile.lastResultCount }}</p>
          <p class="truncate"><span class="font-medium text-foreground">Last error:</span> {{ profile.lastError || 'None' }}</p>
        </div>
      </article>

      <div v-if="!profiles.length" class="rounded-md border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        No profiles yet. Create one to start ingesting issues.
      </div>
    </div>

    <div v-if="dialogOpen" class="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" @click.self="dialogOpen = false">
      <div class="w-full max-w-xl rounded-lg border bg-card p-4 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="font-semibold">{{ dialogTitle }}</h3>
          <Button variant="ghost" size="sm" @click="dialogOpen = false">Close</Button>
        </div>

        <form class="grid gap-3" @submit.prevent="submit">
          <Input v-model="form.name" placeholder="Name" required />
          <p v-if="validationErrors.name?.length" class="text-xs text-destructive">{{ validationErrors.name[0] }}</p>
          <Input v-model="form.description" placeholder="Description" />
          <div class="grid gap-3 md:grid-cols-2">
            <Input v-model="form.labels" placeholder="Labels (comma-separated)" />
            <Input v-model="form.languages" placeholder="Languages (comma-separated)" />
          </div>
          <Input v-model="form.query" placeholder="Additional query" />
          <p v-if="validationErrors.query?.length" class="text-xs text-destructive">{{ validationErrors.query[0] }}</p>
          <div class="grid gap-3 md:grid-cols-3">
            <input
              v-model.number="form.intervalMinutes"
              type="number"
              min="5"
              max="1440"
              class="flex h-9 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
              placeholder="Interval"
            />
            <input
              v-model.number="form.priority"
              type="number"
              min="-100"
              max="100"
              class="flex h-9 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
              placeholder="Priority"
            />
            <label class="flex items-center gap-2 rounded-md border px-3 text-sm">
              <input v-model="form.enabled" type="checkbox" />
              Enabled
            </label>
          </div>
          <p v-if="validationErrors.intervalMinutes?.length" class="text-xs text-destructive">
            {{ validationErrors.intervalMinutes[0] }}
          </p>
          <p v-if="validationErrors.priority?.length" class="text-xs text-destructive">{{ validationErrors.priority[0] }}</p>

          <div class="mt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" @click="dialogOpen = false">Cancel</Button>
            <Button type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save Profile' }}</Button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
