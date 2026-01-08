
export enum CertificateStatus {
  GENERATED = '已生成',
  PENDING = '待处理'
}

export interface Recipient {
  id: string;
  name: string;
  phone: string;
  award: string;
  date: string;
  status: CertificateStatus;
  orgId: string;
  certNumber: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'A4 横向' | 'A4 纵向';
  format: 'PDF' | 'AI' | 'PNG';
  imageUrl: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Placeholder {
  id: string;
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
}
