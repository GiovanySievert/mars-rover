export class RoverOutOfBoundsException extends Error {
  constructor() {
    super('The rover is out of plateau bounds.')
    this.name = 'RoverOutOfBoundsException'
  }
}

export class RoverPositionOccupiedException extends Error {
  constructor() {
    super('The position is occupied by another rover.')
    this.name = 'RoverPositionOccupiedException'
  }
}

export class InvalidDirectionException extends Error {
  constructor() {
    super('Invalid direction provided.')
    this.name = 'InvalidDirectionException'
  }
}

export class InvalidInstructionException extends Error {
  constructor() {
    super(`Invalid instruction provided`)
    this.name = 'InvalidInstructionException'
  }
}

export class RoverNotFound extends Error {
  constructor() {
    super(`Rover not found`)
    this.name = 'RoverNotFound'
  }
}
