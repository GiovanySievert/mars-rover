<template>
  <div class="flex flex-col gap-1">
    <label :for="selectId" class="font-semibold text-left">{{ label }}</label>
    <select
      :id="selectId"
      v-model="selectValue"
      class="border border-gray-300 p-2 rounded-lg h-10"
      :class="{ 'border-red-500': visibleError }"
      @change="onChange"
    >
      <option disabled value="">Selecione uma opção</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="visibleError" class="text-red-500 font-light text-sm">{{ visibleError }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'Select',
  props: {
    modelValue: {
      type: [String, Object],
      required: false
    },
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    errors: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectValue = ref(props.modelValue)
    const selectId = ref(`select-${Math.random().toString(36).substr(2, 9)}`)

    const visibleError = computed(() => {
      return props.errors?.[0]?.$message
    })

    const onChange = () => {
      emit('update:modelValue', selectValue.value)
    }
    watch(
      () => props.modelValue,
      (newValue) => {
        selectValue.value = newValue
      },
      { immediate: true }
    )

    return {
      selectId,
      selectValue,
      onChange,
      visibleError
    }
  }
})
</script>
