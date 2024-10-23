<template>
  <div class="plateau grid gap-2 mx-auto border-4 border-gray-300 rounded-lg max-w-4xl p-3" :style="plateauStyle">
    <div
      v-for="(cell, index) in cells"
      :key="index"
      class="relative bg-gray-200 border-2 rounded-lg aspect-square"
      :class="{
        'border-blue-500': cell.id === selectedRover?.id && cell.hasRover
      }"
      @click="selectRover(cell as Rover)"
    >
      <img
        v-if="cell.hasRover"
        :src="roverImage"
        alt="Rover"
        class="absolute top-0 p-1 object-contain rounded-lg cursor-pointer"
        :class="getRoverDirectionClass(cell.direction)"
      />
      <img
        v-if="martianCell && cell.x === martianCell.x && cell.y === martianCell.y"
        :src="martianImage"
        alt="E.T."
        class="absolute w-24 h-24 object-contain rounded-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      />
    </div>
  </div>
  <p class="mt-3 text-gray-900 font-light">Select a rover in the grid to see its details</p>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useSelectedRover } from '@/composables/UseSelectedRover'

import roverImage from '@/assets/sedan.png'
import martianImage from '@/assets/martian.png'

import { Cell } from '@/Models/cell.model'
import { Rover } from '@/Models/rover.model'

const props = defineProps<{
  width: number
  height: number
  rovers: Rover[]
}>()

const { selectedRover, selectRover } = useSelectedRover()

const martianCell = ref<{ x: string; y: string } | null>(null)

const cells = computed((): Cell[] => {
  const cellArray: Cell[] = []

  for (let rowIndex = 0; rowIndex < props.height; rowIndex++) {
    const y = props.height - 1 - rowIndex
    for (let x = 0; x < props.width; x++) {
      const roversInCell = props.rovers.filter((rover) => Number(rover.x) === x && Number(rover.y) === y)
      const hasRover = roversInCell.length > 0
      const rover = hasRover ? roversInCell[0] : null

      cellArray.push({
        x: x.toString(),
        y: y.toString(),
        hasRover,
        id: rover ? rover.id : null,
        direction: rover ? rover.direction : null
      })
    }
  }

  return cellArray
})

const plateauStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.width}, 1fr)`,
  gridTemplateRows: `repeat(${props.height}, 1fr)`
}))

const getRoverDirectionClass = (direction: string | null) => {
  switch (direction) {
    case 'N':
      return 'rotate-north'
    case 'E':
      return 'rotate-east'
    case 'S':
      return 'rotate-south'
    case 'W':
      return 'rotate-west'
    default:
      return ''
  }
}

const placeETInRandomCell = () => {
  const randomX = Math.floor(Math.random() * props.width).toString()
  const randomY = Math.floor(Math.random() * props.height).toString()

  const cellHasRover = cells.value.some((cell) => cell.x === randomX && cell.y === randomY && cell.hasRover)

  if (cellHasRover) {
    return
  }

  martianCell.value = { x: randomX, y: randomY }

  setTimeout(() => {
    martianCell.value = null
  }, 4000)
}

onMounted(() => {
  setInterval(placeETInRandomCell, 20000)
})
</script>

<style scoped>
.rotate-north {
  transform: rotate(0deg);
}

.rotate-east {
  transform: rotate(90deg);
}

.rotate-south {
  transform: rotate(180deg);
}

.rotate-west {
  transform: rotate(270deg);
}
</style>
