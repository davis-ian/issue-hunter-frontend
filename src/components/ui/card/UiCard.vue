<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    elevated?: boolean
  }>(),
  {
    class: '',
    elevated: false,
  },
)

const classes = computed(() =>
  cn(
    'rounded bg-surface-medium transition-colors',
    props.elevated ? 'bg-surface-high' : '',
    props.class,
  ),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
