<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LoaderCircle, Plus, Terminal, Clock, AlertCircle } from 'lucide-vue-next'
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

const dialogTitle = computed(() => (editingId.value ? 'Edit Profile' : 'New Profile'))

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
    // Error state is handled by composable
  }
}

onMounted(() => {
  void fetchSearches()
})
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-headline-lg text-on-surface">Search Profiles</h1>
        <p class="mt-1 text-body-sm text-on-surface-variant">Configure GitHub issue streams</p>
      </div>
      <Button @click="startCreate">
        <Plus class="h-4 w-4" />
        New Profile
      </Button>
    </div>

    <!-- Error state -->
    <div v-if="error" class="rounded bg-error/10 px-4 py-3 text-body-sm text-error">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex min-h-[240px] items-center justify-center gap-3 text-on-surface-variant">
      <LoaderCircle class="h-5 w-5 animate-spin text-primary" />
      <span class="font-mono text-label-md">Loading profiles...</span>
    </div>

    <!-- Profiles list -->
    <div v-else-if="profiles.length > 0" class="space-y-3">
      <article v-for="profile in profiles" :key="profile.id" class="group rounded-none border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-card))] p-5 shadow-[4px_4px_0_0_hsl(var(--ui-border))]">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-body-lg font-semibold text-on-surface">{{ profile.name }}</h2>
            <Badge :variant="profile.enabled ? 'success' : 'muted'">
              {{ profile.enabled ? 'active' : 'disabled' }}
            </Badge>
            <span class="font-mono text-label-sm text-on-surface-variant">
              prio: {{ profile.priority }}
            </span>
          </div>
          <Button variant="ghost" size="sm" @click="startEdit(profile)">
            Edit
          </Button>
        </div>
        
        <p v-if="profile.description" class="mt-2 text-body-sm text-on-surface-variant">
          {{ profile.description }}
        </p>
        
        <div class="mt-4 grid gap-x-8 gap-y-2 font-mono text-label-sm text-on-surface-variant md:grid-cols-2 lg:grid-cols-4">
          <div class="flex items-center gap-2">
            <Terminal class="h-3.5 w-3.5 text-on-surface-variant" />
            <span>Labels: {{ profile.labels || 'any' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-on-surface-variant">Lang: {{ profile.languages || 'any' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="h-3.5 w-3.5 text-on-surface-variant" />
            <span>Every {{ profile.intervalMinutes }}m</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-primary">{{ profile.lastResultCount }}</span> issues
          </div>
        </div>
        
        <div v-if="profile.lastError" class="mt-3 flex items-center gap-2 font-mono text-label-sm text-error">
          <AlertCircle class="h-3.5 w-3.5" />
          <span>{{ profile.lastError }}</span>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="flex min-h-[200px] items-center justify-center">
      <p class="font-mono text-label-md text-on-surface-variant">No profiles configured</p>
    </div>

    <!-- Create/Edit Dialog -->
    <Teleport to="body">
      <div v-if="dialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-lg rounded-none border-2 border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-header))] p-6 shadow-[6px_6px_0_0_hsl(var(--ui-border))]">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-headline-sm text-on-surface">{{ dialogTitle }}</h3>
            <Button variant="ghost" size="icon-sm" @click="dialogOpen = false">
              <span class="sr-only">Close</span>
              <span>&times;</span>
            </Button>
          </div>

          <form class="space-y-4" @submit.prevent="submit">
            <div>
              <Input v-model="form.name" placeholder="Profile name" required />
              <p v-if="validationErrors.name?.length" class="mt-1 text-label-sm text-error">
                {{ validationErrors.name[0] }}
              </p>
            </div>
            
            <Input v-model="form.description" placeholder="Description (optional)" />
            
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-label-sm text-on-surface-variant">Labels</label>
                <Input v-model="form.labels" placeholder="good first issue, help wanted" />
              </div>
              <div>
                <label class="mb-1 block text-label-sm text-on-surface-variant">Languages</label>
                <Input v-model="form.languages" placeholder="csharp, typescript" />
              </div>
            </div>
            
            <div>
              <label class="mb-1 block text-label-sm text-on-surface-variant">Additional Query</label>
              <Input v-model="form.query" placeholder="is:issue is:open no:assignee" />
              <p v-if="validationErrors.query?.length" class="mt-1 text-label-sm text-error">
                {{ validationErrors.query[0] }}
              </p>
            </div>
            
            <div class="grid gap-4 md:grid-cols-3">
              <div>
                <label class="mb-1 block text-label-sm text-on-surface-variant">Interval (min)</label>
                <input
                  v-model.number="form.intervalMinutes"
                  type="number"
                  min="5"
                  max="1440"
                  class="h-10 w-full border border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-input))] px-3 py-2 text-sm"
                />
                <p v-if="validationErrors.intervalMinutes?.length" class="mt-1 text-label-sm text-error">
                  {{ validationErrors.intervalMinutes[0] }}
                </p>
              </div>
              <div>
                <label class="mb-1 block text-label-sm text-on-surface-variant">Priority</label>
                <input
                  v-model.number="form.priority"
                  type="number"
                  min="-100"
                  max="100"
                  class="h-10 w-full border border-[hsl(var(--ui-border))] bg-[hsl(var(--ui-input))] px-3 py-2 text-sm"
                />
                <p v-if="validationErrors.priority?.length" class="mt-1 text-label-sm text-error">
                  {{ validationErrors.priority[0] }}
                </p>
              </div>
              <div class="flex items-end">
                <label class="flex items-center gap-2 text-label-md text-on-surface">
                  <input v-model="form.enabled" type="checkbox" class="h-4 w-4 rounded border-outline bg-surface-lowest" />
                  Enabled
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" @click="dialogOpen = false">
                Cancel
              </Button>
              <Button type="submit" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save Profile' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </section>
</template>
