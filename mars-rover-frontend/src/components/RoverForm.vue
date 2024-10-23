<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col gap-3 text-center">
      <p class="block mb-2 text-2xl text-gray-900 font-bold">Add Rover</p>
      <div class="flex flex-col gap-3">
        <Input
          v-model="newRover.x"
          label="Position X"
          placeholder="Enter the X position"
          type="number"
          :errors="v$.newRover.x.$errors"
        />
        <Input
          v-model="newRover.y"
          label="Position Y"
          placeholder="Enter the Y position"
          type="number"
          :errors="v$.newRover.y.$errors"
        />
        <div>
          <Select
            v-model="newRover.direction"
            label="Direction"
            :options="[
              { label: 'North', value: 'N' },
              { label: 'South', value: 'S' },
              { label: 'East', value: 'E' },
              { label: 'West', value: 'W' }
            ]"
            :errors="v$.newRover.direction.$errors"
          />
        </div>
      </div>

      <button @click="addRover" class="bg-blue-600 px-4 py-2 rounded-lg mt-2" :disabled="isSubmitting">
        <p class="text-white font-semibold">
          {{ isSubmitting ? 'Adding...' : 'Add Rover' }}
        </p>
      </button>

      <button v-if="rovers.length" @click="deleteAllRovers" class="bg-red-600 px-4 py-2 rounded-lg">
        <p class="text-white font-semibold">Delete All Rovers</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { AxiosError } from 'axios'

import { roverService } from '@/services/rover.service'
import { useSelectedRover } from '@/composables/UseSelectedRover'
import { useToast } from '@/composables/UseToast'
import { Rover } from '@/Models/rover.model'

import Input from '@/components/Commom/Input.vue'
import Select from '@/components/Commom/Select.vue'

const props = defineProps<{
  rovers: Rover[]
  fetchRovers: () => Promise<void>
}>()

const { selectRover } = useSelectedRover()
const { showError } = useToast()

const newRover = ref({ x: '0', y: '0', direction: 'N' })
const isSubmitting = ref(false)
const validDirections = ['N', 'S', 'E', 'W']

const addRover = async () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    return
  }

  isSubmitting.value = true
  try {
    const rover = await roverService.createRover(newRover.value)
    newRover.value = { x: '0', y: '0', direction: 'N' }

    selectRover(rover.data)
    props.fetchRovers()
  } catch (error) {
    if (error instanceof AxiosError) {
      showError(error.response?.data.message)
    } else {
      showError('Unexpected error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const deleteAllRovers = async () => {
  try {
    await roverService.deleteAllRovers()

    props.fetchRovers()
    selectRover(null)
  } catch (error) {
    showError('Failed to delete all rovers, please try again.')
  }
}

const rules = {
  newRover: {
    x: {
      required: { $message: 'X position is required.' },
      numeric: { $message: 'X position must be a valid number.' },
      isPositive: helpers.withMessage('X position must be greater than or equal to 0.', (value) => Number(value) >= 0)
    },
    y: {
      required: { $message: 'Y position is required.' },
      numeric: { $message: 'Y position must be a valid number.' },
      isPositive: helpers.withMessage('Y position must be greater than or equal to 0.', (value) => Number(value) >= 0)
    },
    direction: {
      required: { $message: 'Direction is required.' },
      isValidDirection: helpers.withMessage(
        'Invalid direction. Choose between N, S, E, W.',
        (value) => value !== '' && validDirections.includes(value as string)
      )
    }
  }
}

const v$ = useVuelidate(rules, { newRover })
</script>
