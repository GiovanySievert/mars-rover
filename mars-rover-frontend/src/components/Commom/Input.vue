<template>
  <div class="flex flex-col gap-1">
    <label :for="inputId" class="font-semibold text-left">{{ label }}</label>
    <input
      :id="inputId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      class="border border-gray-300 p-2 rounded-lg h-10"
      :class="{ 'border-red-500': visibleError }"
      @blur="onBlur"
    />
    <span v-if="visibleError" class="text-red-500 font-light text-sm">{{ visibleError }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

interface ValidationError {
  $message: string
}

export default defineComponent({
  name: 'Input',
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    errors: {
      type: Array as () => ValidationError[],
      required: false,
      default() {
        return []
      }
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue)
    const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

    const visibleError = computed(() => {
      return props.errors?.[0]?.$message
    })

    const onBlur = () => {
      emit('update:modelValue', inputValue.value)
    }

    watch(
      () => props.modelValue,
      (newValue) => {
        inputValue.value = newValue
      }
    )

    return {
      inputId,
      inputValue,
      onBlur,
      visibleError
    }
  }
})
</script>

<style scoped>
.border-red-500 {
  border-color: red;
}
</style>
