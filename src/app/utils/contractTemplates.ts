// src/app/utils/contractTemplates.ts

import { directPurchaseTemplate } from './directPurchaseTemplate';
import { specificPurchaseTemplate } from './specificPurchaseTemplate';
import { specificPurchaseDeliveryTemplate } from './specificPurchaseDeliveryTemplate';
import { directPurchasePBTemplate } from './directPurchasePBTemplate';

// 공통 데이터 인터페이스
export interface ContractData {
  supplierName: string;
  ceo: string;
  address: string;
  contractDate: string;
  tradeStartDate: string;
  tradeEndDate: string;
  tradePeriod: string;
  [key: string]: string; // 동적 필드 허용
}

// [핵심] 공통 서명란 생성 함수 (Table 구조 + 잘림 방지)
export const getSignatureHTML = (
  data: ContractData, 
  options: { kyoboAddress?: string; kyoboCeo?: string } = {}
) => {
  const kyoboAddress = options.kyoboAddress || "서울특별시 종로구 종로 1";
  const kyoboCeo = options.kyoboCeo || "안병현"; // 기본 대표이사

  return `
    <div class="signature-section" style="margin-top: 50px; page-break-inside: avoid; break-inside: avoid;">
      <div class="style-bodycenter" style="margin-bottom: 30px; text-align: center; font-weight: bold; font-size: 18px;">
        ${data.contractDate || '20__년 __월 __일'}
      </div>
      
      <table style="width: 100%; border-collapse: collapse; border: none; font-family: sans-serif;">
        <colgroup>
          <col style="width: 50%;" />
          <col style="width: 50%;" />
        </colgroup>
        <tbody>
          <tr>
            <td style="border: none; vertical-align: top; padding: 10px; line-height: 1.8; font-size: 14px;">
              <div style="margin-bottom: 8px;">

                <span style="display:block;">주 &nbsp; &nbsp; 소 : ${kyoboAddress}</span>
                <span style="display:block;">상 &nbsp; &nbsp; 호 : (주) 교보문고</span>
                <span style="display:block;">대표이사 : ${kyoboCeo} (인)</span>
              </div>
            </td>
            
            <td style="border: none; vertical-align: top; padding: 10px; line-height: 1.8; font-size: 14px;">
              <div style="margin-bottom: 8px;">

                <span style="display:block;">주 &nbsp; &nbsp; 소 : ${data.address || '(주소 입력)'}</span>
                <span style="display:block;">상 &nbsp; &nbsp; 호 : ${data.supplierName || '(상호 입력)'}</span>
                <span style="display:block;">대표이사 : ${data.ceo || '(대표자 입력)'} (인)</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

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
      
    // 추후 추가될 양식들
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