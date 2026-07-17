import { 
  ProductionSchedule, 
  BOMPart, 
  TroubleShootingRecord, 
  SOPDocument, 
  AutomationProject, 
  ImprovementProposal 
} from '../types';

export const initialSchedules: ProductionSchedule[] = [
  {
    id: 'S-01',
    line: 'A-Wing Assembly Line (A동 날개 조립라인)',
    partName: 'F-35 Wing Flap Panel (플랩 패널)',
    planQty: 12,
    actualQty: 11,
    status: 'normal',
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    id: 'S-02',
    line: 'B-CNC Mill Machining (B동 전정밀 CNC 가공라인)',
    partName: 'Titanium Engine Bracket (엔진 브라켓)',
    planQty: 50,
    actualQty: 42,
    status: 'warning',
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    id: 'S-03',
    line: 'C-Composite Curing (C동 복합소재 경화라인)',
    partName: 'Carbon Fuselage Skin (탄소섬유 동체 스킨)',
    planQty: 4,
    actualQty: 1,
    status: 'danger',
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    id: 'S-04',
    line: 'D-Wiring Harness (D동 배선 하네스 결선)',
    partName: 'Avionics Interconnect Loom (항전 하네스)',
    planQty: 25,
    actualQty: 25,
    status: 'normal',
    startTime: '08:00',
    endTime: '18:00'
  }
];

export const initialBOMParts: BOMPart[] = [
  {
    id: 'B-01',
    partNumber: 'TI-HEX-8822',
    partName: 'Titanium Hex Bolt (M8 x 40)',
    category: 'Fastener',
    stock: 120,
    minSafetyStock: 300,
    leadTimeDays: 14,
    unit: 'EA',
    status: 'danger' // Shortage
  },
  {
    id: 'B-02',
    partNumber: 'AV-IMU-9100',
    partName: 'Tactical IMU Sensor Module',
    category: 'Sensor',
    stock: 15,
    minSafetyStock: 10,
    leadTimeDays: 45,
    unit: 'EA',
    status: 'normal'
  },
  {
    id: 'B-03',
    partNumber: 'CF-SHEET-220',
    partName: 'Carbon Fiber Prepreg (Grade A-3)',
    category: 'Structure',
    stock: 45,
    minSafetyStock: 40,
    leadTimeDays: 20,
    unit: 'Roll',
    status: 'warning' // Near safety stock
  },
  {
    id: 'B-04',
    partNumber: 'AV-CONN-40P',
    partName: 'Mil-Spec 40-Pin Circular Connector',
    category: 'Avionics',
    stock: 80,
    minSafetyStock: 50,
    leadTimeDays: 10,
    unit: 'EA',
    status: 'normal'
  },
  {
    id: 'B-05',
    partNumber: 'TI-BRK-5521',
    partName: 'Support Anchor Plate (Ti-6Al-4V)',
    category: 'Structure',
    stock: 8,
    minSafetyStock: 20,
    leadTimeDays: 30,
    unit: 'EA',
    status: 'danger' // Shortage
  }
];

export const initialTroubleShootingLogs: TroubleShootingRecord[] = [
  {
    id: 'TS-001',
    equipmentName: 'CNC 밀링 머신 (Mazak-V100)',
    errorCode: 'ERR-E504 (Overload Spindle)',
    phenomenon: '티타늄 황삭 가공 중 주축 부하율이 120%를 초과하면서 설비 급정지 발생.',
    cause: '가공 툴(엔드밀) 마모 누적으로 인한 저항 급증 및 절삭유 분사 압력 저하.',
    solution: '마모된 툴을 신품 코팅 엔드밀로 교체하고, 고압 절삭유 노즐의 이물질 청소 및 분사 유량을 원래 수준인 25L/min으로 세팅 변경 후 부하 테스트 진행.',
    tags: ['CNC', 'Spindle', 'Tooling', '티타늄'],
    severity: 'high',
    author: '김민수 책임 (공정개선팀)',
    createdAt: '2026-07-10'
  },
  {
    id: 'TS-002',
    equipmentName: '복합소재 오토클레이브 (Curing-03)',
    errorCode: 'WARN-T112 (Temp Deviation)',
    phenomenon: '경화 가열 사이클 중 150℃ 유지 단계에서 특정 챔버 영역 온도 편차가 ±5℃ 초과하여 알람 발생.',
    cause: '챔버 내부 가열 히터 3번 라인의 접점 불량으로 인한 발열 불균일.',
    solution: '내부 센서 단자 재결선 및 고전력 접촉기(Magnetic Contactor) 접점 그리스 도포 및 오염 단자 세척. 온도 리딩 재보정 실시.',
    tags: ['오토클레이브', '복합소재', '온도센서', '전장'],
    severity: 'medium',
    author: '박정우 선임 (전기보전)',
    createdAt: '2026-07-12'
  },
  {
    id: 'TS-003',
    equipmentName: '정밀 하네스 크림핑 툴 (Amphenol-M3)',
    errorCode: 'ERR-C023 (Crimp Force Defect)',
    phenomenon: '항전 장비 케이블 압착 후 인장강도 테스트 시 이탈력 기준(150N) 미달로 불량 발생.',
    cause: '크림퍼 다이(Die) 마모 및 스프링 인장력 감퇴로 인한 압착 압력 편차 발생.',
    solution: '다이(Die) 고정 볼트 조임상태 점검 후 다이 세트를 교체하고 압착 두께(Crimp Height) 정밀 게이지로 재세팅 마이크로미터 캘리브레이션 시행.',
    tags: ['하네스', '압착', '검사불량', '항전'],
    severity: 'medium',
    author: '이지은 연구원 (품질보증)',
    createdAt: '2026-07-15'
  }
];

export const initialSOPs: SOPDocument[] = [
  {
    id: 'SOP-A1',
    docNumber: 'AERO-SOP-W-012',
    title: 'F-35 플랩 패널 복합소재 리벳팅 및 실링 가공 표준서',
    version: 'v4.2',
    lastUpdated: '2026-05-20',
    processType: '조립 (Assembly)',
    category: '날개 조립',
    steps: [
      {
        stepNo: 1,
        title: '접착면 사전 세척 및 알코올 와이핑',
        description: '부품 접합면의 가공유 및 먼지를 아이소프로필 알코올(IPA) 전용 클리너로 1방향 와이핑합니다.',
        warning: '먼지가 잔존할 경우 경화 접착력 저하가 발생하므로 보풀이 없는 와이퍼를 사용하십시오.'
      },
      {
        stepNo: 2,
        title: '접착 실란트 혼합 및 프라이머 도포',
        description: '항공우주 등급 실란트 PR-1422를 혼합 비율 10:1에 맞추어 균일하게 교반 후 프라이머를 미세 도포합니다.',
        warning: '혼합 후 2시간 내에 완전 도포가 완료되어야 점도 상승을 방지할 수 있습니다.'
      },
      {
        stepNo: 3,
        title: '티타늄 리벳 삽입 및 공압 토크 고정',
        description: '토크 렌치를 사용하여 규정 토크(24.5 Nm ± 0.5)를 인가하며 순차적으로 리벳을 가공합니다.',
        warning: '대각선 크로스 패턴 순서로 인가해야 단면 뒤틀림을 방지합니다.'
      },
      {
        stepNo: 4,
        title: '최종 비파괴 검사(NDT) 및 두께 확인',
        description: '포터블 초음파 측정기를 사용하여 틈새 및 내부 기포 잔존 여부를 밀리미터 단위로 정밀 확인합니다.'
      }
    ]
  },
  {
    id: 'SOP-C2',
    docNumber: 'AERO-SOP-C-045',
    title: '엔진 마운트 브라켓 티타늄 5축 가공 셋업 표준서',
    version: 'v2.1',
    lastUpdated: '2026-06-11',
    processType: '가공 (Machining)',
    category: '5축 가공',
    steps: [
      {
        stepNo: 1,
        title: '공작물 바이스 고정 및 영점 세팅',
        description: '원소재 Ti-6Al-4V 블록을 바이스 중앙에 정렬하고 토크 렌치를 이용해 120Nm으로 조입니다.',
        warning: '바이스 조임 토크 부족 시 가공 중 이탈 우려가 있습니다.'
      },
      {
        stepNo: 2,
        title: 'G-Code 로딩 및 툴 오프셋 확인',
        description: '컨트롤러에 최신 프로그램 파일명(TM-ENG-BKT-REV3.NC)을 로딩하고 터치 프로브를 활용해 XYZ 영점 세팅을 검증합니다.'
      },
      {
        stepNo: 3,
        title: '가공 중 절삭유 미스트 분사 유량 확인',
        description: '스핀들 가열을 방지하고 칩 배출을 원활히 하기 위해 분사 압력이 5.0 bar 이상인지 모니터링합니다.',
        warning: '절삭유 압력이 부족하면 티타늄 표면 버닝 및 툴 깨짐이 발생합니다.'
      }
    ]
  }
];

export const initialAutomationTasks: AutomationProject[] = [
  {
    id: 'AUT-01',
    taskName: '날개 조립 라인 로봇 리벳 자동 정렬 장치',
    processName: '날개 체결 공정',
    cost: 4500, // 4500만원
    expectedSavings: 1800, // 연간 1800만원 절감
    stage: '시운전',
    roiYears: 2.5,
    updatedAt: '2026-07-14',
    description: '기존 수작업으로 투입하던 수백 개의 티타늄 리벳을 카메라 비전 센서 기반의 다축 로봇 그리퍼로 자동 정렬 및 가체결하는 과제'
  },
  {
    id: 'AUT-02',
    taskName: '오토클레이브 챔버 자동 무인 물류 AGV 도입',
    processName: '복합재 이송',
    cost: 8500,
    expectedSavings: 2500,
    stage: '설계',
    roiYears: 3.4,
    updatedAt: '2026-07-11',
    description: '고온 고압 공정 대기 구역과 워크 테이블 간 적재물을 무인 반송하는 AGV 2대 도입 및 관제 시스템 연동 과제'
  },
  {
    id: 'AUT-03',
    taskName: 'BOM 자재 창고 스마트 키팅 수량 센서 스마트랙',
    processName: '부품 패키징 및 출고',
    cost: 1500,
    expectedSavings: 1200,
    stage: '완료',
    roiYears: 1.25,
    updatedAt: '2026-06-30',
    description: '작업자가 자재를 피킹할 때 디지털 표시기와 LED 유도등을 통해 정량 수거를 보장하고 잔여량을 즉각 클라우드로 업데이트하는 스마트 랙 설치'
  },
  {
    id: 'AUT-04',
    taskName: '스마트 프레스 금형 마모 정밀 레이저 측정',
    processName: '금형 프레스 성형',
    cost: 3200,
    expectedSavings: 800,
    stage: '기획',
    roiYears: 4.0,
    updatedAt: '2026-07-16',
    description: '제품의 미세 갭 결함을 최소화하기 위해 스트로크 작동 후 고정밀 레이저 스캐너를 투입해 표면 형상 마모율을 준실시간으로 계측하는 기술 제안'
  }
];

export const initialIdeas: ImprovementProposal[] = [
  {
    id: 'IP-01',
    title: '케이블 하네스 결선 작업대 높낮이 전동 실린더화 제안',
    category: 'Safety',
    description: '현재 수작업 배선 하네스를 제작할 때 높낮이가 고정되어 있어 신장 편차에 따라 목 및 허리 피로 누적이 심해 안전 및 불량률에 미세 영향이 발생합니다.',
    expectedEffect: '작업자별 신체 치수에 맞춤형 인체공학 높이 조정으로 근골격계 질환 예방 및 집중력 강화로 배선 불량 15% 감축 기대',
    author: '임경민 반장',
    department: '생산2과 하네스반',
    likes: 24,
    status: '개발중',
    createdAt: '2026-07-08'
  },
  {
    id: 'IP-02',
    title: 'CNC 가공 가루(칩) 세정용 진공 흡입 노즐 설계 개선',
    category: 'Efficiency',
    description: '가공 완료 후 에어건(Air Gun)으로 칩을 불어내다 보니 미세 칩이 근처 슬라이드 레일에 박혀 마모를 부추기고 공장 내 분진을 유발합니다. 이를 밀폐 진공 흡입 방식으로 보완 설계하고자 합니다.',
    expectedEffect: '비산 분진 원천 차단으로 환경 개선 및 설비 레일 수명 연장 효과, 수작업 청소 시간 일당 20분 단축.',
    author: '이영훈 선임',
    department: '제조생산기술 1팀',
    likes: 42,
    status: '검토중',
    createdAt: '2026-07-12'
  },
  {
    id: 'IP-03',
    title: '자재 보관 구역 바코드 스캐너 홀더 및 멀티 전원 스탠드 배치',
    category: 'Cost',
    description: '자재 키팅 요원들이 무선 스캐너를 매번 들고 다니거나 바닥에 올려두어 잦은 충격 및 단선 수리 비용이 들고 있습니다. 거치용 스마트 홀더를 간이 3D 프린터로 자체 제작 적용하고 충전 크래들을 일체화하는 제안입니다.',
    expectedEffect: '스캐너 단선 파손 비용 연간 약 300만원 절감 및 손자유화 작업으로 키팅 속도 단축.',
    author: '황정식 조장',
    department: '자재물류과',
    likes: 18,
    status: '적용완료',
    createdAt: '2026-07-15'
  }
];
