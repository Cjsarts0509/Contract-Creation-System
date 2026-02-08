// src/app/utils/contractTemplates.ts

import { directPurchaseTemplate } from './directPurchaseTemplate';
import { specificPurchaseTemplate } from './specificPurchaseTemplate';
import { specificPurchaseDeliveryTemplate } from './specificPurchaseDeliveryTemplate';
import { directPurchasePBTemplate } from './directPurchasePBTemplate';

// [수정됨] 공통 데이터 인터페이스 (동적 키 허용)
export interface ContractData {
  supplierName: string;
  ceo: string;
  address: string;
  contractDate: string;
  tradeStartDate: string;
  tradeEndDate: string;
  tradePeriod: string;
  
  // 동적 필드 허용 (category, items 등 고정 키 외에 무엇이든 들어올 수 있음)
  [key: string]: string; 
}

export const getContractTemplate = (
  contractType: string,
  data: ContractData
): string => {
  switch (contractType) {
    case 'direct':
      return directPurchaseTemplate(data);
    case 'specific':
      return specificPurchaseTemplate(data);
    case 'specificDelivery':
      return specificPurchaseDeliveryTemplate(data);
    case 'directPB':
      return directPurchasePBTemplate(data);
      
    // 추후 추가될 양식들 (임시 연결)
    case 'contractETC1':
    case 'contractETC2':
    case 'contractETC3':
    case 'contractETC4':
    case 'contractETC5':
    case 'contractETC6':
       return `<div class="contract-page" style="padding:50px;"><h3>${contractType} 양식 준비중입니다.</h3><p>입력된 데이터: ${JSON.stringify(data)}</p></div>`;

    default:
      return '계약서 양식을 선택하면 내용이 표시됩니다.';
  }
};