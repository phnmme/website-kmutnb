export interface CoopChartItem {
  year: number;
  graduates: number;
  coopEmployed: number;
}

export interface EmploymentSectorItem {
  year: number;
  private: number;
  government: number;
}

export interface DashboardStatistics {
  coopChart: CoopChartItem[];
  employmentSectorChart: EmploymentSectorItem[];
}
