<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-container text-on-primary hover:opacity-90',
        secondary: 'bg-surface-high text-primary hover:bg-surface-highest',
        ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high ghost-border',
        tertiary: 'bg-transparent text-primary ghost-border hover:bg-surface-low',
        destructive: 'bg-error text-error-foreground hover:opacity-90',
      },
      size: {
        default: 'h-9 px-4 py-2 text-label-lg rounded',
        sm: 'h-8 px-3 text-label-md rounded-sm',
        lg: 'h-10 px-6 text-label-lg rounded',
        icon: 'h-9 w-9 text-label-lg rounded',
        'icon-sm': 'h-8 w-8 text-label-md rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    class?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    type: 'button',
    class: '',
    disabled: false,
  },
)

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
