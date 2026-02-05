export interface MtrLine {
  id: string;
  name: string;
  color?: string;
  stations: MtrStation[];
}

export interface MtrStation {
  id: string;
  name: string;
}

export const MTR_DATA: MtrLine[] = [
  {
    id: 'AEL',
    name: 'Airport Express',
    stations: [
      { id: 'HOK', name: 'Hong Kong' },
      { id: 'KOW', name: 'Kowloon' },
      { id: 'TSY', name: 'Tsing Yi' },
      { id: 'AIR', name: 'Airport' },
      { id: 'AWE', name: 'AsiaWorld Expo' },
    ],
  },
  {
    id: 'TCL',
    name: 'Tung Chung Line',
    stations: [
      { id: 'HOK', name: 'Hong Kong' },
      { id: 'KOW', name: 'Kowloon' },
      { id: 'OLY', name: 'Olympic' },
      { id: 'NAC', name: 'Nam Cheong' },
      { id: 'LAK', name: 'Lai King' },
      { id: 'TSY', name: 'Tsing Yi' },
      { id: 'SUN', name: 'Sunny Bay' },
      { id: 'TUC', name: 'Tung Chung' },
    ],
  },
  {
    id: 'TML',
    name: 'Tuen Ma Line',
    stations: [
      { id: 'WKS', name: 'Wu Kai Sha' },
      { id: 'MOS', name: 'Ma On Shan' },
      { id: 'HEO', name: 'Heng On' },
      { id: 'TSH', name: 'Tai Shui Hang' },
      { id: 'SHM', name: 'Shek Mun' },
      { id: 'CIO', name: 'City One' },
      { id: 'STW', name: 'Sha Tin Wai' },
      { id: 'CKT', name: 'Che Kung Temple' },
      { id: 'TAW', name: 'Tai Wai' },
      { id: 'HIK', name: 'Hin Keng' },
      { id: 'DIH', name: 'Diamond Hill' },
      { id: 'KAT', name: 'Kai Tak' },
      { id: 'SUW', name: 'Sung Wong Toi' },
      { id: 'TKW', name: 'To Kwa Wan' },
      { id: 'HOM', name: 'Ho Man Tin' },
      { id: 'HUH', name: 'Hung Hom' },
      { id: 'ETS', name: 'East Tsim Sha Tsui' },
      { id: 'AUS', name: 'Austin' },
      { id: 'NAC', name: 'Nam Cheong' },
      { id: 'MEF', name: 'Mei Foo' },
      { id: 'TWW', name: 'Tsuen Wan West' },
      { id: 'KSR', name: 'Kam Sheung Road' },
      { id: 'YUL', name: 'Yuen Long' },
      { id: 'LOP', name: 'Long Ping' },
      { id: 'TIS', name: 'Tin Shui Wai' },
      { id: 'SIH', name: 'Siu Hong' },
      { id: 'TUM', name: 'Tuen Mun' },
    ],
  },
  {
    id: 'TKL',
    name: 'Tseung Kwan O Line',
    stations: [
      { id: 'NOP', name: 'North Point' },
      { id: 'QUB', name: 'Quarry Bay' },
      { id: 'YAT', name: 'Yau Tong' },
      { id: 'TIK', name: 'Tiu Keng Leng' },
      { id: 'TKO', name: 'Tseung Kwan O' },
      { id: 'LHP', name: 'LOHAS Park' },
      { id: 'HAH', name: 'Hang Hau' },
      { id: 'POA', name: 'Po Lam' },
    ],
  },
  {
    id: 'EAL',
    name: 'East Rail Line',
    stations: [
      { id: 'ADM', name: 'Admiralty' },
      { id: 'EXC', name: 'Exhibition Centre' },
      { id: 'HUH', name: 'Hung Hom' },
      { id: 'MKK', name: 'Mong Kok East' },
      { id: 'KOT', name: 'Kowloon Tong' },
      { id: 'TAW', name: 'Tai Wai' },
      { id: 'SHT', name: 'Sha Tin' },
      { id: 'FOT', name: 'Fo Tan' },
      { id: 'RAC', name: 'Racecourse' },
      { id: 'UNI', name: 'University' },
      { id: 'TAP', name: 'Tai Po Market' },
      { id: 'TWO', name: 'Tai Wo' },
      { id: 'FAN', name: 'Fanling' },
      { id: 'SHS', name: 'Sheung Shui' },
      { id: 'LOW', name: 'Lo Wu' },
      { id: 'LMC', name: 'Lok Ma Chau' },
    ],
  },
  {
    id: 'SIL',
    name: 'South Island Line',
    stations: [
      { id: 'ADM', name: 'Admiralty' },
      { id: 'OCP', name: 'Ocean Park' },
      { id: 'WCH', name: 'Wong Chuk Hang' },
      { id: 'LET', name: 'Lei Tung' },
      { id: 'SOH', name: 'South Horizons' },
    ],
  },
  {
    id: 'TWL',
    name: 'Tsuen Wan Line',
    stations: [
      { id: 'CEN', name: 'Central' },
      { id: 'ADM', name: 'Admiralty' },
      { id: 'TST', name: 'Tsim Sha Tsui' },
      { id: 'JOR', name: 'Jordan' },
      { id: 'YMT', name: 'Yau Ma Tei' },
      { id: 'MOK', name: 'Mong Kok' },
      { id: 'PRE', name: 'Prince Edward' },
      { id: 'SSP', name: 'Sham Shui Po' },
      { id: 'CSW', name: 'Cheung Sha Wan' },
      { id: 'LCK', name: 'Lai Chi Kok' },
      { id: 'MEF', name: 'Mei Foo' },
      { id: 'LAK', name: 'Lai King' },
      { id: 'KWF', name: 'Kwai Fong' },
      { id: 'KWH', name: 'Kwai Hing' },
      { id: 'TWH', name: 'Tai Wo Hau' },
      { id: 'TSW', name: 'Tsuen Wan' },
    ],
  },
  {
    id: 'ISL',
    name: 'Island Line',
    stations: [
      { id: 'KET', name: 'Kennedy Town' },
      { id: 'HKU', name: 'HKU' },
      { id: 'SYP', name: 'Sai Ying Pun' },
      { id: 'SHW', name: 'Sheung Wan' },
      { id: 'CEN', name: 'Central' },
      { id: 'ADM', name: 'Admiralty' },
      { id: 'WAC', name: 'Wan Chai' },
      { id: 'CAB', name: 'Causeway Bay' },
      { id: 'TIH', name: 'Tin Hau' },
      { id: 'FOH', name: 'Fortress Hill' },
      { id: 'NOP', name: 'North Point' },
      { id: 'QUB', name: 'Quarry Bay' },
      { id: 'TAK', name: 'Tai Koo' },
      { id: 'SWH', name: 'Sai Wan Ho' },
      { id: 'SKW', name: 'Shau Kei Wan' },
      { id: 'HFC', name: 'Heng Fa Chuen' },
      { id: 'CHW', name: 'Chai Wan' },
    ],
  },
  {
    id: 'KTL',
    name: 'Kwun Tong Line',
    stations: [
      { id: 'WHA', name: 'Whampoa' },
      { id: 'HOM', name: 'Ho Man Tin' },
      { id: 'YMT', name: 'Yau Ma Tei' },
      { id: 'MOK', name: 'Mong Kok' },
      { id: 'PRE', name: 'Prince Edward' },
      { id: 'SKM', name: 'Shek Kip Mei' },
      { id: 'KOT', name: 'Kowloon Tong' },
      { id: 'LOF', name: 'Lok Fu' },
      { id: 'WTS', name: 'Wong Tai Sin' },
      { id: 'DIH', name: 'Diamond Hill' },
      { id: 'CHH', name: 'Choi Hung' },
      { id: 'KOB', name: 'Kowloon Bay' },
      { id: 'NTK', name: 'Ngau Tau Kok' },
      { id: 'KWT', name: 'Kwun Tong' },
      { id: 'LAT', name: 'Lam Tin' },
      { id: 'YAT', name: 'Yau Tong' },
      { id: 'TIK', name: 'Tiu Keng Leng' },
    ],
  },
  {
    id: 'DRL',
    name: 'Disneyland Resort Line',
    stations: [
      { id: 'SUN', name: 'Sunny Bay' },
      { id: 'DIS', name: 'Disneyland Resort' },
    ],
  },
];

export const MTR_STATION: Record<string, string> = {
  // Airport Express (AEL)
  HOK: 'Hong Kong',
  KOW: 'Kowloon',
  TSY: 'Tsing Yi',
  AIR: 'Airport',
  AWE: 'AsiaWorld Expo',

  // Tung Chung Line (TCL) - Unique stations only (HOK, KOW, TSY already defined)
  OLY: 'Olympic',
  NAC: 'Nam Cheong',
  LAK: 'Lai King',
  SUN: 'Sunny Bay',
  TUC: 'Tung Chung',

  // Tuen Ma Line (TML)
  WKS: 'Wu Kai Sha',
  MOS: 'Ma On Shan',
  HEO: 'Heng On',
  TSH: 'Tai Shui Hang',
  SHM: 'Shek Mun',
  CIO: 'City One',
  STW: 'Sha Tin Wai',
  CKT: 'Che Kung Temple',
  TAW: 'Tai Wai',
  HIK: 'Hin Keng',
  DIH: 'Diamond Hill',
  KAT: 'Kai Tak',
  SUW: 'Sung Wong Toi',
  TKW: 'To Kwa Wan',
  HOM: 'Ho Man Tin',
  HUH: 'Hung Hom',
  ETS: 'East Tsim Sha Tsui',
  AUS: 'Austin',
  // NAC already defined
  MEF: 'Mei Foo',
  TWW: 'Tsuen Wan West',
  KSR: 'Kam Sheung Road',
  YUL: 'Yuen Long',
  LOP: 'Long Ping',
  TIS: 'Tin Shui Wai',
  SIH: 'Siu Hong',
  TUM: 'Tuen Mun',

  // Tseung Kwan O Line (TKL)
  NOP: 'North Point',
  QUB: 'Quarry Bay',
  YAT: 'Yau Tong',
  TIK: 'Tiu Keng Leng',
  TKO: 'Tseung Kwan O',
  LHP: 'LOHAS Park',
  HAH: 'Hang Hau',
  POA: 'Po Lam',

  // East Rail Line (EAL)
  ADM: 'Admiralty',
  EXC: 'Exhibition Centre',
  // HUH already defined
  MKK: 'Mong Kok East',
  KOT: 'Kowloon Tong',
  // TAW already defined
  SHT: 'Sha Tin',
  FOT: 'Fo Tan',
  RAC: 'Racecourse',
  UNI: 'University',
  TAP: 'Tai Po Market',
  TWO: 'Tai Wo',
  FAN: 'Fanling',
  SHS: 'Sheung Shui',
  LOW: 'Lo Wu',
  LMC: 'Lok Ma Chau',

  // South Island Line (SIL)
  // ADM already defined
  OCP: 'Ocean Park',
  WCH: 'Wong Chuk Hang',
  LET: 'Lei Tung',
  SOH: 'South Horizons',

  // Tsuen Wan Line (TWL)
  CEN: 'Central',
  // ADM already defined
  TST: 'Tsim Sha Tsui',
  JOR: 'Jordan',
  YMT: 'Yau Ma Tei',
  MOK: 'Mong Kok',
  PRE: 'Prince Edward',
  SSP: 'Sham Shui Po',
  CSW: 'Cheung Sha Wan',
  LCK: 'Lai Chi Kok',
  // MEF already defined
  // LAK already defined
  KWF: 'Kwai Fong',
  KWH: 'Kwai Hing',
  TWH: 'Tai Wo Hau',
  TSW: 'Tsuen Wan',

  // Island Line (ISL)
  KET: 'Kennedy Town',
  HKU: 'HKU',
  SYP: 'Sai Ying Pun',
  SHW: 'Sheung Wan',
  // CEN already defined
  // ADM already defined
  WAC: 'Wan Chai',
  CAB: 'Causeway Bay',
  TIH: 'Tin Hau',
  FOH: 'Fortress Hill',
  // NOP already defined
  // QUB already defined
  TAK: 'Tai Koo',
  SWH: 'Sai Wan Ho',
  SKW: 'Shau Kei Wan',
  HFC: 'Heng Fa Chuen',
  CHW: 'Chai Wan',

  // Kwun Tong Line (KTL)
  WHA: 'Whampoa',
  // HOM already defined
  // YMT already defined
  // MOK already defined
  // PRE already defined
  SKM: 'Shek Kip Mei',
  // KOT already defined
  LOF: 'Lok Fu',
  WTS: 'Wong Tai Sin',
  // DIH already defined
  CHH: 'Choi Hung',
  KOB: 'Kowloon Bay',
  NTK: 'Ngau Tau Kok',
  KWT: 'Kwun Tong',
  LAT: 'Lam Tin',
  // YAT already defined
  // TIK already defined

  // Disneyland Resort Line (DRL)
  // SUN already defined
  DIS: 'Disneyland Resort',
};

export const convertStationIdToName = (stationId: string): string => {
  return MTR_STATION[stationId] || stationId;
};