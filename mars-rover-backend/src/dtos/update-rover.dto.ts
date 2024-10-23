import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateRoverDTO {
  @IsString()
  @IsNotEmpty()
  instructions!: string
}
