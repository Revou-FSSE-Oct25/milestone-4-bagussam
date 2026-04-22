import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class DepositWithdrawDto {
  @IsNumber()
  @IsPositive({ message: 'Jumlah tidak boleh negatif atau nol' })
  amount: number;
}

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  receiverAccountId: string;

  @IsNumber()
  @IsPositive({ message: 'Jumlah transfer tidak boleh negatif atau nol' })
  amount: number;
}