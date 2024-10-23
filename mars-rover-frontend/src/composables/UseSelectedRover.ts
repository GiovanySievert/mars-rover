import { ref } from 'vue'
import { Rover } from '../Models/rover.model'

const selectedRover = ref<Rover | null>(null)

export function useSelectedRover() {
  const selectRover = (rover: Rover | null) => {
    selectedRover.value = rover
  }

  return {
    selectedRover,
    selectRover
  }
}
