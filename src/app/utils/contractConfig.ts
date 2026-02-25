export interface ContractField {
  label: string;
  key: string;
  placeholder: string;
  type?: 'text' | 'number'; // [추가] 입력 타입 지정 (옵션)
}

// 각 계약서 타입별로 필요한 필드 정의
export const CONTRACT_CONFIG: Record<string, ContractField[]> = {
  // 1. 직매입
  'direct': [
    { label: '구분', key: 'category', placeholder: '구분 입력' },
    { label: '거래품목', key: 'items', placeholder: '거래품목 입력' },
    { label: '취급브랜드', key: 'brand', placeholder: '취급브랜드 입력' },
    { label: '수수료', key: 'commission', placeholder: '수수료 입력' },
  ],
  // 2. 직매입(PB)
  'directPB': [
    { label: '계약명', key: 'contractName', placeholder: '계약명 입력' },
    // [수정] type: 'number' 추가 -> 숫자 전용 및 콤마 자동 적용
    { label: '총 계약금액', key: 'totalAmount', placeholder: '총 계약금액 예정 입력', type: 'number' },
    { label: '제작물', key: 'productionItem', placeholder: '제작물 내용 입력' },
  ],
  // 3. 특정매입
  'specific': [
    { label: '점포명', key: 'storeName', placeholder: '점포명 입력' },
    { label: '카테고리', key: 'category', placeholder: '카테고리 입력' },
    { label: '거래품목', key: 'items', placeholder: '거래품목 입력' },
    { label: '취급브랜드', key: 'brand', placeholder: '취급브랜드 입력' },
    { label: '수수료', key: 'commission', placeholder: '수수료 입력' },
  ],
  // 4. 특정매입(배송대행)
  'specificDelivery': [
    { label: '수수료(업체)', key: 'commissionVendor', placeholder: '수수료율(업체배송) 입력' },
    { label: '수수료(교보)', key: 'commissionKyobo', placeholder: '수수료율(교보문고배송) 입력' },
  ],
  
  // 나머지 기타 양식들...
  'contractETC1': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
  'contractETC2': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
  'contractETC3': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
  'contractETC4': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
  'contractETC5': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
  'contractETC6': [{ label: '입력항목1', key: 'field1', placeholder: '내용 입력' }],
};