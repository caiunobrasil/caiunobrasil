import type { ServiceStatus, StatusInfo } from '../types';

export function getStatusInfo(status: ServiceStatus): StatusInfo {
  switch (status) {
    case 'operational':
      return {
        title: 'Operacional',
        description: 'O serviço está funcionando normalmente',
        color: 'rgb(var(--status-operational))',
        bg: 'rgb(var(--status-operational), 0.1)',
        textColor: 'rgb(var(--status-operational))'
      };
    case 'issues':
      return {
        title: 'Instabilidade',
        description: 'O serviço está apresentando alguns problemas',
        color: 'rgb(var(--status-issues))',
        bg: 'rgb(var(--status-issues), 0.1)',
        textColor: 'rgb(var(--status-issues))'
      };
    case 'down':
      return {
        title: 'Fora do Ar',
        description: 'O serviço está completamente indisponível',
        color: 'rgb(var(--status-down))',
        bg: 'rgb(var(--status-down), 0.1)',
        textColor: 'rgb(var(--status-down))'
      };
    default:
      return {
        title: 'Verificando',
        description: 'Verificando o status do serviço',
        color: 'rgb(var(--md-sys-color-secondary))',
        bg: 'rgb(var(--md-sys-color-secondary), 0.1)',
        textColor: 'rgb(var(--md-sys-color-secondary))'
      };
  }
}