
import { Recipient, CertificateStatus, Template, Organization, Placeholder } from '../types';

export const ORGANIZATIONS: Organization[] = [
  { id: '1', name: '中舞艺协艺术中心' },
  { id: '2', name: '红舞鞋少儿芭蕾' },
  { id: '3', name: '盛世华章中国舞院' },
];

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: '陈小舞',
    phone: '13800000001',
    award: '中国民族民间舞·金奖',
    date: '2024-05-20',
    status: CertificateStatus.GENERATED,
    orgId: '1',
    certNumber: 'DANCE-2024-001'
  },
  {
    id: '2',
    name: '林梦圆',
    phone: '13800000002',
    award: '古典舞基本功大赛·一等奖',
    date: '2024-06-15',
    status: CertificateStatus.PENDING,
    orgId: '2',
    certNumber: 'DANCE-2024-042'
  }
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: '全国青少年中国舞展演证书',
    description: '大气中国红风格，适用于大型舞蹈比赛、展演证书颁发。',
    type: 'A4 横向',
    format: 'PNG',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800&h=566' // Placeholder for a red elegant backdrop
  }
];

export const MOCK_PLACEHOLDERS: Placeholder[] = [
  {
    id: 'p1',
    key: 'recipient_name',
    label: '获奖者姓名',
    x: 300,
    y: 220,
    width: 200,
    height: 60,
    fontSize: 36,
    color: '#333333',
    align: 'center'
  },
  {
    id: 'p2',
    key: 'award_title',
    label: '奖项名称',
    x: 200,
    y: 310,
    width: 400,
    height: 50,
    fontSize: 24,
    color: '#b91c1c',
    align: 'center'
  },
  {
    id: 'p3',
    key: 'cert_date',
    label: '颁发日期',
    x: 520,
    y: 460,
    width: 200,
    height: 30,
    fontSize: 16,
    color: '#666666',
    align: 'right'
  }
];
