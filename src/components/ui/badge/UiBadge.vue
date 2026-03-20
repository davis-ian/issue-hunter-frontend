<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center font-mono text-label-sm uppercase tracking-wider px-2 py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-surface-high text-on-surface-variant',
        success: 'bg-surface-high text-primary',
        destructive: 'bg-error/10 text-error',
        muted: 'bg-surface-low text-on-surface-variant',
        outline: 'bg-transparent text-on-surface-variant',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariants = VariantProps<typeof badgeVariants>

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariants['variant']
    class?: string
  }>(),
  {
    variant: 'default',
    class: '',
  },
)

const classes = computed(() => cn(badgeVariants({ variant: props.variant }), props.class))
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
