
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Recipient {
  category: string;
  contact: string;
  reason: string;
}

export interface ReportData {
  summary: string;
  recipients: Recipient[];
}

export enum View {
  Chat = 'CHAT',
  Report = 'REPORT',
}
