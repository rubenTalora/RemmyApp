<template>
    <button
        :class="[
            'px-6 py-3 rounded-btn font-semibold transition-all duration-200 ease-out',
            animationEnabled ? 'shadow-card hover:shadow-panel' : 'shadow-card',
            animationEnabled ? 'transform hover:-translate-y-0.5 active:translate-y-0.5' : '',
            'focus:outline-none focus:ring-4 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-card disabled:hover:translate-y-0',
            variantClasses,
        ]"
        :disabled="disabled"
        @click="handleClick"
    >
        <slot>{{ label }}</slot>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    label?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    animationEnabled?: boolean;
}>();

const emit = defineEmits<{
    click: [];
}>();

const animationEnabled = computed(() => props.animationEnabled !== false);

const variantClasses = computed(() => {
    const variant = props.variant || 'primary';

    switch (variant) {
        case 'primary':
            return 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-200';
        case 'secondary':
            return 'bg-surface hover:bg-surface-muted text-ink border border-line focus:ring-slate-200';
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-200';
        default:
            return 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-200';
    }
});

const handleClick = () => {
    emit('click');
};
</script>
