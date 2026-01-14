
import { Recipient, CertificateStatus, Template, Organization, Placeholder } from '../types';

export const ORGANIZATIONS: Organization[] = [
  { id: '1', name: '中舞艺协艺术中心' },
  { id: '2', name: '红舞鞋少儿芭蕾' },
  { id: '3', name: '盛世华章中国舞院' },
];

const awardTitles = [
  '中国民族民间舞',
  '古典舞基本功大赛',
  '少儿现代舞',
  '街舞精英挑战赛',
  '芭蕾舞表演赛',
  '中国武术套路比赛',
  '钢琴演奏会',
  '书法艺术展',
  '绘画创作比赛',
  '演讲与口才大会',
];

const awardRanks = ['金奖', '银奖', '铜奖', '特等奖', '一等奖', '二等奖', '三等奖', '优秀奖'];

// 常用中文姓氏
const familyNames = [
  '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑',
  '谢', '唐', '韩', '曹', '许', '邓', '萧', '曾', '潘', '蔡'
];

// 常用中文名字片段
const givenNames = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '军', '勇',
  '磊', '杰', '霞', '涛', '明', '艳', '红', '玲', '华', '平',
  '建', '新', '德', '梅', '兰', '清', '玉', '文', '斌', '晓'
];

// 少数民族或复合姓氏风格的长姓名
const longNames = [
  '迪丽热巴·买买提',
  '爱新觉罗·启星',
  '欧阳娜娜',
  '诸葛亮',
  '上官婉儿',
  '司马迁',
  '完颜慧德',
  '扎西卓玛',
  '阿依古丽·阿布拉',
  '努尔买买提·吐尔逊',
];

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: '陈小舞',
    phone: '13800000001',
    awardTitle: '中国民族民间舞', // 拆分后的奖项名称
    awardRank: '金奖',             // 拆分后的获奖名次
    date: '2024-05-20',
    status: CertificateStatus.GENERATED,
    orgId: '1',
    certNumber: 'DANCE-2024-001',
    templateCode: 'HONOR_CERT_BLUE_FRAME', // 关联模板
    placeholderOverrides: { // 个性化调整示例：姓名Y轴下移，字体增大，奖项颜色改变
      'recipient_name': { y: 360, fontSize: 52 },
      'award_subject': { color: '#00695c' } // 更新为新的占位符
    },
    isEnabled: true, // 默认启用
  },
  {
    id: '2',
    name: '林梦圆',
    phone: '13800000002',
    awardTitle: '古典舞基本功大赛',
    awardRank: '一等奖',
    date: '2024-06-15',
    status: CertificateStatus.PENDING,
    orgId: '2',
    certNumber: 'DANCE-2024-042',
    templateCode: 'HONOR_CERT_BLUE_FRAME', // 关联模板
    isEnabled: true, // 默认启用
  }
];

// 生成50个额外的测试数据
for (let i = 0; i < 50; i++) {
  const baseId = INITIAL_RECIPIENTS.length + 1;
  const year = 2024 - Math.floor(i / 10); // 制造一些年份变化
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

  let randomName;
  if (Math.random() < 0.1) { // 10%的几率生成长姓名
    randomName = longNames[Math.floor(Math.random() * longNames.length)];
  } else {
    // 随机组合姓氏和名字
    const randomFamilyName = familyNames[Math.floor(Math.random() * familyNames.length)];
    const randomGivenName1 = givenNames[Math.floor(Math.random() * givenNames.length)];
    const randomGivenName2 = givenNames[Math.floor(Math.random() * givenNames.length)];
    randomName = randomFamilyName + randomGivenName1 + (Math.random() > 0.5 ? randomGivenName2 : ''); // 名字可能是两个字或三个字
  }

  INITIAL_RECIPIENTS.push({
    id: `${baseId + i}`,
    name: randomName,
    phone: `139${String(Math.floor(Math.random() * 90000000) + 10000000).padStart(8, '0')}`,
    awardTitle: awardTitles[Math.floor(Math.random() * awardTitles.length)],
    awardRank: awardRanks[Math.floor(Math.random() * awardRanks.length)],
    date: `${year}-${month}-${day}`,
    status: Math.random() > 0.5 ? CertificateStatus.GENERATED : CertificateStatus.PENDING,
    orgId: ORGANIZATIONS[Math.floor(Math.random() * ORGANIZATIONS.length)].id,
    certNumber: `TEST-${year}-${String(baseId + i).padStart(3, '0')}`,
    templateCode: 'HONOR_CERT_BLUE_FRAME',
    isEnabled: Math.random() > 0.1, // 90%几率启用，10%几率停用
  });
}


export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: '荣誉证书模板',
    description: '典雅蓝金边框荣誉证书，适用于各类正式表彰场合。',
    type: 'A4 横向',
    format: 'PNG',
    imageUrl: 'https://images.unsplash.com/photo-1618204116909-c4873837072d?auto=format&fit=crop&q=80&w=1200', // Replaced the failing image URL
    code: 'HONOR_CERT_BLUE_FRAME'
  }
];

export const MOCK_PLACEHOLDERS: Placeholder[] = [
  {
    id: 'p1',
    key: 'recipient_name',
    label: '获奖人姓名',
    x: 400,
    y: 350,
    width: 300,
    height: 60,
    fontSize: 48,
    color: '#333333',
    align: 'center',
  },
  {
    id: 'p2',
    key: 'award_subject', // 新增：奖项名称占位符
    label: '奖项名称',
    x: 400,
    y: 450,
    width: 500,
    height: 40,
    fontSize: 36,
    color: '#333333',
    align: 'center',
  },
  {
    id: 'p6', // 新增：获奖名次占位符
    key: 'award_rank',
    label: '获奖名次',
    x: 400,
    y: 500, // 调整Y轴，使其在奖项名称下方
    width: 300,
    height: 30,
    fontSize: 30,
    color: '#d32f2f',
    align: 'center',
  },
  {
    id: 'p3',
    key: 'cert_date',
    label: '颁发日期',
    x: 600,
    y: 650,
    width: 200,
    height: 40,
    fontSize: 24,
    color: '#666666',
    align: 'right',
  },
  {
    id: 'p4',
    key: 'cert_number',
    label: '证书编号',
    x: 100,
    y: 650,
    width: 250,
    height: 30,
    fontSize: 18,
    color: '#999999',
    align: 'left',
  },
  {
    id: 'p5',
    key: 'organization_name',
    label: '颁发机构',
    x: 600,
    y: 600,
    width: 250,
    height: 40,
    fontSize: 28,
    color: '#333333',
    align: 'right',
  },
];
