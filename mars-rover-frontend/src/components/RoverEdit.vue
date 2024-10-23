<template>
  <div class="flex flex-col items-center">
    <p class="block mb-2 text-2xl text-gray-900 font-bold">Edit Rover</p>
    <RoverResult v-if="selectedRover?.id" :rover="selectedRover" />

    <div v-if="selectedRover" class="flex flex-col gap-3 mt-4">
      <Input
        :label="'Instructions for Rover ' + selectedRover.id"
        v-model="instructions"
        type="text"
        placeholder="Ex: LMLMLMLMM"
        :errors="v$.instructions.$errors"
      />

      <button @click="submitInstructions" class="bg-green-600 px-4 py-2 rounded-lg">
        <p class="text-white font-semibold">Submit Instructions</p>
      </button>

      <button @click="deleteRover" class="bg-red-600 px-4 py-2 rounded-lg">
        <p class="text-white font-semibold">Delete Rover</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AxiosError } from 'axios'

import { roverService } from '@/services/rover.service'
import { Rover } from '@/Models/rover.model'

import { useSelectedRover } from '@/composables/UseSelectedRover'
import { useToast } from '@/composables/UseToast'

import Input from './Commom/Input.vue'
import RoverResult from './RoverResult.vue'

const props = defineProps<{
  rovers: Rover[]
  fetchRovers: () => Promise<void>
}>()

const { selectedRover, selectRover } = useSelectedRover()
const { showError } = useToast()

const instructions = ref('')
const validInstructions = ['L', 'R', 'M']

const submitInstructions = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  try {
    const rover = selectedRover.value

    if (!rover) return

    const response = await roverService.updateRover(rover.id, instructions.value.toUpperCase())

    props.fetchRovers()
    selectRover(response.data)

    return response
  } catch (error) {
    if (error instanceof AxiosError) {
      showError(error.response?.data.message)
    } else {
      showError('Unexpected error')
    }
  }
}

const deleteRover = async () => {
  try {
    const rover = selectedRover.value

    if (!rover) return

    await roverService.deleteRover(rover.id)

    props.fetchRovers()
    selectRover(null)
    instructions.value = ''
  } catch (error) {
    showError('Failed to delete rover, please try again.')
  }
}

const rules = {
  instructions: {
    required: helpers.withMessage('Instructions are required.', (value: string | null) => !!value),
    isValidDirection: helpers.withMessage('Invalid instructions', (value: string) => {
      return value.split('').every((char: string) => validInstructions.includes(char.toUpperCase()))
    })
  }
}

const v$ = useVuelidate(rules, { instructions })
</script>
