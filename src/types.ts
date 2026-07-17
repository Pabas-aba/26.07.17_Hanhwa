export interface ProductionSchedule {
  id: string;
  line: string;
  partName: string;
  planQty: number;
  actualQty: number;
  status: 'normal' | 'warning' | 'danger';
  startTime: string;
  endTime: string;
}

export interface BOMPart {
  id: string;
  partNumber: string;
  partName: string;
  category: 'Structure' | 'Avionics' | 'Fastener' | 'Sensor';
  stock: number;
  minSafetyStock: number;
  leadTimeDays: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger'; // danger = shortage
}

export interface TroubleShootingRecord {
  id: string;
  equipmentName: string;
  errorCode: string;
  phenomenon: string;
  cause: string;
  solution: string;
  tags: string[];
  severity: 'low' | 'medium' | 'high';
  author: string;
  createdAt: string;
}

export interface SOPDocument {
  id: string;
  docNumber: string;
  title: string;
  version: string;
  lastUpdated: string;
  processType: string;
  steps: {
    stepNo: number;
    title: string;
    description: string;
    warning?: string;
    imagePlaceholder?: string;
  }[];
  category: string;
}

export interface AutomationProject {
  id: string;
  taskName: string;
  processName: string;
  cost: number; // KRW (10k)
  expectedSavings: number; // KRW (10k/year)
  stage: '기획' | '설계' | '시운전' | '완료';
  roiYears: number;
  updatedAt: string;
  description: string;
}

export interface CapaProcess {
  name: string;
  cycleTime: number; // in seconds
  workers: number;
}

export interface ImprovementProposal {
  id: string;
  title: string;
  category: 'Safety' | 'Quality' | 'Efficiency' | 'Cost';
  description: string;
  expectedEffect: string;
  author: string;
  department: string;
  likes: number;
  status: '제안' | '검토중' | '개발중' | '적용완료';
  createdAt: string;
}

export type PersonalizationRole = 'junior' | 'senior' | 'operator';
