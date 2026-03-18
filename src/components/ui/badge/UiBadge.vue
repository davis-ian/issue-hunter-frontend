<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'border-border bg-muted text-foreground',
      success: 'border-border bg-accent text-foreground',
      destructive: 'border-border bg-muted text-muted-foreground',
      outline: 'border-border bg-card text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

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
