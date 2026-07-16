// types/index.ts
export interface Icon {
  id: number;
  name: string;
  label?: string;
}

export interface Link {
  id: number;
  slug: string;
  name: string;
  url: string;
  desc: string;
  iconName: string;
  status: 'online' | 'offline' | 'maintenance';
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  iconName: string;
  colorHex: string;
  links: Link[];
  createdAt: string;
  updatedAt: string;
}

// types/index.ts
export interface Court {
  id: number;
  name: string;
}

export interface Case {
  id: number;
  filingDate?: string;
  caseNumber?: string;
  caseYear?: string;
  court?: string;
  caseTitle?: string;
  caseParties?: string;
  assigned?: boolean;
  assignedDate?: string;
  judgeName?: string;
  caseReference?: string;
  nextStageDate?: string;
  nextStageTime?: string;
  nextStage?: string;
  courtRoomName?: string;
  proceedingOutcomeStatus?: string;
  lastOrder?: string | null;
  caseOutcome?: string | null;
  isDecided?: boolean;
}

