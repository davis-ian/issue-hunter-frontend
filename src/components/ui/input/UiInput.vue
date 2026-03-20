<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    class?: string
    disabled?: boolean
    min?: number
    max?: number
    step?: number
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    class: '',
    disabled: false,
    min: undefined,
    max: undefined,
    step: undefined,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() =>
  cn(
    'flex h-10 w-full border border-[#222] bg-white px-3 py-2 text-sm text-[#111] placeholder:text-[#777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc600] disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <input
    :class="classes"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
