
export enum CertificateStatus {
  GENERATED = '已生成',
  PENDING = '待处理'
}

export interface Recipient {
  id: string;
  name: string;
  phone: string;
  awardTitle: string; // 新增：奖项名称
  awardRank: string;  // 新增：获奖名次
  date: string;
  status: CertificateStatus;
  orgId: string;
  certNumber: string;
  templateCode?: string; // 新增：关联使用的模板代码
  placeholderOverrides?: { [key: string]: Partial<Omit<Placeholder, 'id' | 'key' | 'label'>> }; // 新增：个性化占位符覆盖
  isEnabled: boolean; // 新增：证书是否启用（可被查询和下载）
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'A4 横向' | 'A4 纵向';
  format: 'PDF' | 'AI' | 'PNG';
  imageUrl: string;
  code: string; // 新增：模板唯一标识代码，全大写
}

export interface Organization {
  id: string;
  // Fix: Added `name` property to Organization interface
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