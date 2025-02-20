export type ServiceStatus = 'operational' | 'issues' | 'down' | 'checking';

export interface Service {
  name: string;
  url: string;
  slug: string;
  status: ServiceStatus;
  lastCheck: Date;
  reportCount: number;
}

export interface StatusInfo {
  title: string;
  description: string;
  color: string;
  bg: string;
  textColor: string;
}

export interface ServiceCategory {
  name: string;
  services: Service[];
}