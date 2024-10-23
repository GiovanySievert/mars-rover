<template>
  <div class="">
    <p class="mb-2">This rover is currently at:</p>
    <p class="mb-2"><strong>Coordinate X:</strong> {{ rover.x }}</p>
    <p class="mb-2"><strong>Coordinate Y:</strong> {{ rover.y }}</p>
    <p class="mb-2"><strong>Direction:</strong> {{ formattedDirection }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Rover } from '@/Models/rover.model'
import { computed } from 'vue'

const props = defineProps<{
  rover: Rover
}>()

const formattedDirection = computed(() => {
  const directionMap: Record<string, string> = {
    N: 'North',
    E: 'East',
    S: 'South',
    W: 'West'
  }
  return directionMap[props.rover.direction]
})
</script>
