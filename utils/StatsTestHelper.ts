// Utilitário para testar e debugar estatísticas
export class StatsTestHelper {
  // Simular dados de teste para verificar se o sistema funciona
  static createTestStats() {
    return {
      tasksCompleted: 5,
      totalPoints: 350,
      vouchersRedeemed: 2,
    };
  }

  // Logar estado completo das estatísticas
  static logStatsState(context: string, stats: any, userData: any, loading: boolean) {
  }

  // Verificar se as estatísticas estão funcionando
  static validateStats(stats: any): boolean {
    const isValid = (
      typeof stats.tasksCompleted === 'number' &&
      typeof stats.totalPoints === 'number' &&
      typeof stats.vouchersRedeemed === 'number'
    );
    
    return isValid;
  }

  // Simular ação de completar task
  static simulateTaskCompletion(addCompletedTask: (points: number) => void) {
    addCompletedTask(50);
  }

  // Simular resgatar voucher
  static async simulateVoucherRedeem(redeemVoucher: (cost: number, voucher: any) => Promise<boolean>) {
    const result = await redeemVoucher(100, {
      voucherId: 'test-voucher-1',
      title: 'Voucher de Teste'
    });
    return result;
  }
}