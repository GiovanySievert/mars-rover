import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateRoverDTO {
  @IsNumber()
  @IsNotEmpty()
  x!: number

  @IsNumber()
  @IsNotEmpty()
  y!: number

  @IsString()
  @IsNotEmpty()
  direction!: string
}
