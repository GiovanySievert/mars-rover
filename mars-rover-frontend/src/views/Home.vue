<template>
  <div class="min-h-screen flex flex-col lg:flex-row items-center justify-center">
    <div class="p-5 h-full w-full lg:w-2/3 text-center">
      <h1 class="text-4xl font-bold mb-8">Mars Rover Mission</h1>
      <PlateauMap :width="plateauWidth" :height="plateauHeight" :rovers="rovers" />
    </div>

    <div class="flex flex-col gap-10 w-full mb-4 lg:w-auto mt-8 lg:mt-0 lg:ml-8">
      <RoverForm :rovers="rovers" :fetchRovers="fetchRovers" />
      <RoverEdit v-if="selectedRover?.id" :rovers="rovers" :fetchRovers="fetchRovers" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'

import { roverService } from '@/services/rover.service'
import { useSelectedRover } from '@/composables/UseSelectedRover'
import { Rover } from '@/Models/rover.model'
import { useToast } from '@/composables/UseToast'

import RoverForm from '@/components/RoverForm.vue'
import RoverEdit from '@/components/RoverEdit.vue'
import PlateauMap from '@/components/PlateauMap.vue'

const { selectedRover } = useSelectedRover()
const { showError } = useToast()

const rovers = ref<Rover[]>([])
const plateauWidth = ref<number>(11)
const plateauHeight = ref<number>(11)

const fetchRovers = async () => {
  try {
    const response = await roverService.getRovers()
    rovers.value = response.data
  } catch (error) {
    showError('Failed to fetch rovers')
  }
}

onMounted(async () => {
  await fetchRovers()
})
</script>
