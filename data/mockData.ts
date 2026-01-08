
import { Recipient, CertificateStatus, Template, Organization, Placeholder } from '../types';

export const ORGANIZATIONS: Organization[] = [
  { id: '1', name: '第一实验小学' },
  { id: '2', name: '阳光艺术培训中心' },
  { id: '3', name: '未来星编程学院' },
];

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: '张三',
    phone: '13800000001',
    award: '2023年度优秀员工奖',
    date: '2023-10-27',
    status: CertificateStatus.GENERATED,
    orgId: '1',
    certNumber: 'CERT-2023-001'
  },
  {
    id: '2',
    name: '李四',
    phone: '13800000002',
    award: '最佳新人奖',
    date: '2023-11-05',
    status: CertificateStatus.PENDING,
    orgId: '2',
    certNumber: 'CERT-2023-042'
  },
  {
    id: '3',
    name: '王明',
    phone: '13800000003',
    award: '技术贡献奖',
    date: '2023-10-27',
    status: CertificateStatus.GENERATED,
    orgId: '3',
    certNumber: 'CERT-2023-015'
  },
  {
    id: '4',
    name: '赵六',
    phone: '13800000004',
    award: '季度销售冠军',
    date: '2023-11-10',
    status: CertificateStatus.GENERATED,
    orgId: '1',
    certNumber: 'CERT-2023-088'
  },
  {
    id: '5',
    name: '陈七',
    phone: '13800000005',
    award: '最具潜力奖',
    date: '2023-11-12',
    status: CertificateStatus.PENDING,
    orgId: '2',
    certNumber: 'CERT-2023-102'
  },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: '优秀员工荣誉证书',
    description: '适用于年度表彰大会，包含防伪纹路底纹与金箔烫印设计区域。',
    type: 'A4 横向',
    format: 'PDF',
    imageUrl: 'https://picsum.photos/seed/cert1/800/566'
  },
  {
    id: 't2',
    name: '通用培训结业证书',
    description: '蓝色商务风格，适用于各类内部培训及技能考核通过证明。',
    type: 'A4 横向',
    format: 'AI',
    imageUrl: 'https://picsum.photos/seed/cert2/800/566'
  },
  {
    id: 't3',
    name: '极简设计奖状',
    description: '现代简约几何风格，适合创意类比赛或年轻化团队活动颁奖。',
    type: 'A4 纵向',
    format: 'PDF',
    imageUrl: 'https://picsum.photos/seed/cert3/800/566'
  },
  {
    id: 't4',
    name: '志愿者服务证明',
    description: '温馨暖色调，感谢志愿者参与公益活动。',
    type: 'A4 横向',
    format: 'PNG',
    imageUrl: 'https://picsum.photos/seed/cert4/800/566'
  }
];

export const MOCK_PLACEHOLDERS: Placeholder[] = [
  {
    id: 'p1',
    key: 'recipient_name',
    label: '获奖者姓名',
    x: 120,
    y: 198,
    width: 560,
    height: 80,
    fontSize: 48,
    color: '#1A1F23',
    align: 'center'
  },
  {
    id: 'p2',
    key: 'award_title',
    label: '奖项名称',
    x: 160,
    y: 140,
    width: 480,
    height: 40,
    fontSize: 18,
    color: '#64748b',
    align: 'center'
  }
];
