import { BalanceResponseDto } from '../dto/balance-response.dto';
import { SettlementDto } from '../dto/settlement-response.dto';

export class DebtSimplifier {
  static simplify(balances: BalanceResponseDto[]): SettlementDto[] {
    // Separar acreedores (balance > 0) y deudores (balance < 0)
    const creditors = balances
      .filter((b) => b.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const debtors = balances
      .filter((b) => b.balance < 0)
      .sort((a, b) => a.balance - b.balance);

    const settlements: SettlementDto[] = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    // Algoritmo greedy: emparejar montos mínimos
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const creditorBalance = creditor.balance;
      const debtorDebt = Math.abs(debtor.balance);

      const amount = Math.min(creditorBalance, debtorDebt);

      settlements.push({
        from: debtor.participantName,
        to: creditor.participantName,
        amount,
      });

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance === 0) creditorIndex++;
      if (debtor.balance === 0) debtorIndex++;
    }

    return settlements;
  }
}

