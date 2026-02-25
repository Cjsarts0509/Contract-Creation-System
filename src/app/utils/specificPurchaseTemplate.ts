import { ContractData } from './contractTemplates';


export const specificPurchaseTemplate = (data: ContractData) => `
<div class="contract-page contract-paper">
  <div class="style-title">특정매입 거래계약서</div>

  <div class="style-bodycenter">(주)교보문고와 "${data.supplierName || '□□□'}"(을)는 다음과 같이 계약을 체결한다.</div>

  <div class="style-subtitle">▪제 1 조 (목적)</div>
  <div class="style-body">이 계약서의 작성 목적은 (주)교보문고와 "${data.supplierName || '□□□'}" 간 상품의 특정매입거래((주) 교보문고가 매입한 상품 중 판매되지 아니한 상품을 반품할 수 있는 조건으로 "${data.supplierName || '□□□'}"으로부터 상품을 외상 매입하고 상품판매 후 일정률이나 일정액의 판매수익을 공제한 상품판매대금을 "${data.supplierName || '□□□'}"에게 지급하는 형태의 거래를 말한다)에서 양 당사자 사이의 기본적인 권리와 의무를 정하기 위함에 있다.</div>

  <div class="style-subtitle">▪제 2 조 (상품납품 등)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"(이)가 (주) 교보문고에게 공급하는 상품의 브랜드는 [별첨1]을 따른다.<br>② (주) 교보문고는 협력사네트워크[SCM](https://scm.kyobobook.co.kr/)을 통해 상품의 종류, 수량 및 가격, 납품장소를 지정하여 "${data.supplierName || '□□□'}"에게 발주할 수 있다. 상품의 종류, 수량 및 가격과 납품장소는 발주의뢰서, 매입전표, 세금계산서 등으로 대신할 수 있다.<br>③ "${data.supplierName || '□□□'}"(은)는 합리적인 시장가격 정책으로 (주) 교보문고의 고객에게 피해가 발생하지 않도록 노력하여야 하며, (주) 교보문고와 "${data.supplierName || '□□□'}"(은)는 필요시에 상대방과 협의 후, 상품의 판매가격을 조정 할 수 있다.<br>④ "${data.supplierName || '□□□'}" (은)는 제2항의 발주일로부터 3일 이내에 지정된 장소에 소스코드를 부착한 상품을 공급하여야 한다. 단, 부득이한 사유로 3일 이내에 공급이 불가능한 경우에는 해당 기일의 전일까지 (주) 교보문고에게 납품기한의 연장을 요청하여 사전 승인을 받아야 한다.<br>⑤ "${data.supplierName || '□□□'}"(은)는 "원산지표시" 및 "어린이제품안전특별법", "전기용품 및 생활용품 안전관리법"에 의한 품질표시를 부착하여 관계법령 및 상호 합의한 품질기준을 유지하여야 하며, 제반 법규 사항을 모두 준수한 합법적 상품만을 공급하여야 한다. 만약 이를 어기고 판매하여 문제가 발생할 경우 "${data.supplierName || '□□□'}"(은)는 당해 위반행위로 인하여 발생한 (주) 교보문고의 손해액((주) 교보문고에게 부과된 벌금 또는 과태료 및 고객 보상과 관련된 제비용 일체)을 전액 배상하여야 한다.<br>⑥ "${data.supplierName || '□□□'}"(은)는 (주) 교보문고가 발주하는 품목별 규격별 수량을 (주) 교보문고 또는 (주) 교보문고의 지정인에게 공급함에 있어, (주) 교보문고의 반입·출 규정에 의거하여 공급을 완료하여야 한다.<br>⑦ 상품의 공급 전후 (주) 교보문고의 점포에서 정상적인 판매에 이르기까지 발생한 멸실, 공손, 감량, 변질, 기타 일체의 손해는 "${data.supplierName || '□□□'}"의 부담으로 한다. 다만, (주) 교보문고의 귀책사유가 명백한 경우는 이에 해당되지 아니한다.<br>⑧ 위탁 상품의 보관 및 관리에 대한 책임은 "${data.supplierName || '□□□'}" 또는 "${data.supplierName || '□□□'}"의 대리인에게 있다.<br>⑨ (주) 교보문고와 "${data.supplierName || '□□□'}"(은)는 효율적인 물류시스템 구축을 통한 물류 선진화를 위해 상호 협조한다.</div>

  <div class="style-subtitle">▪제 3 조 (검수기준 및 품질검사)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"(은)는 납품하는 상품에 관하여 (주) 교보문고의 검수기준에 따른 검수를 받아야 한다.<br>② (주) 교보문고는 상품의 품질, 규격, 관련법령의 허용기준 등 "${data.supplierName || '□□□'}"이 납품하는 상품에 관한 검수기준을 사전에 "${data.supplierName || '□□□'}"에게 서면(전자문서포함)으로 제시하여야 한다.<br>③ (주) 교보문고는 "${data.supplierName || '□□□'}"(이)가 납품하는 상품에 대하여 품질검사 및 성분검사가 필요한 경우 "${data.supplierName || '□□□'}"에게 해당 검사를 요구할 수 있다. 이 경우 "${data.supplierName || '□□□'}"(은)는 공인된 검사기관으로부터 검사를 받은 후 검사결과를 해당 상품의 납품전에 (주) 교보문고에게 제출하며, 검사비용은 "${data.supplierName || '□□□'}"(이)가 부담한다. 단, 그 검사결과 합격 또는 적합 판정을 받은 경우로서 다음 각 호의 어느 하나에 해당하는 경우에는 (주) 교보문고가 검사비용을 부담한다.<br>&nbsp;&nbsp;1. "${data.supplierName || '□□□'}" (이)가 검사 이전에 이미 해당 상품에 대한 적절한 품질검사 또는 성분검사 등을 거쳐 이미 합격 또는 적합 판정을 받은 경우<br>&nbsp;&nbsp;2. 상품의 특성상 추가적인 공인기관의 검사를 거치지 않더라도 해당 상품의 품질적합 여부가 외관상 뚜렷이 판단될 수 있는 등 처음부터 품질검사 및 성분검사가 필요하지 않았다고 인정될 수 있는 경우<br>④ 품질검사 및 성분검사 결과 "${data.supplierName || '□□□'}"(이)가 납품한 상품이 파손, 오손, 품질 또는 규격 상이, 변질 등 상품에 하자가 있는 경우 상품인수를 거절할 수 있다.</div>

  <div class="style-subtitle">▪제 4 조 (판매대금 지급조건 및 지급기일)</div>
  <div class="style-body">① 지급조건 : 현금<br>② 지급기일 : 판매마감일 익월 20일<br>③ (주) 교보문고는 판매대금을 지급함에 있어 "${data.supplierName || '□□□'}"과 사전합의에 의하여 판매대금으로 지급해야 할 금액에서 "${data.supplierName || '□□□'}"(이)가 (주) 교보문고에게 납부하여야 하는 비용을 공제한 금원을 지급할 수 있으며, 이 경우 (주) 교보문고는 공제 내역을 "${data.supplierName || '□□□'}"에게 고지한다.<br>④ (주) 교보문고는 판매대금을 지급해야하는 날이 공휴일 또는 (주) 교보문고의 휴무일일 경우 공휴일 또는 휴무일 익일에 지급한다.</div>

  <div class="style-subtitle">▪제 5 조 (상품의 반품)</div>
  <div class="style-body">① (주) 교보문고는 다음 각 호에 해당하는 경우 반품할 수 있다.<br>&nbsp;&nbsp;1. "${data.supplierName || '□□□'}"의 귀책사유로 인한 상품 오손, 훼손, 파손 등 납품상품에 하자가 있는 경우<br>&nbsp;&nbsp;2. 장기 미 판매 상품, 신ㆍ구 상품 교체 등 양 당사자가 상품판매 활성화를 위하여 필요한 경우<br>&nbsp;&nbsp;3. 본 계약에 따른 거래기간이 종료될 때까지 판매되지 않은 상품<br>② "${data.supplierName || '□□□'}" (은)는 발주 및 계약수량을 초과한 상품, 귀책사유로 계약이 해제된 상품, 또는 제①항1호에 해당되어 (주) 교보문고으로부터 반품되는 상품은 "${data.supplierName || '□□□'}" 의 부담으로 즉시 회수하여야 한다.<br>③ (주) 교보문고는 "${data.supplierName || '□□□'}" (이)가 제②항을 성실히 이행하지 않을 시, "${data.supplierName || '□□□'}" 의 부담으로 상품을 반송하거나 기타 필요한 조치를 취할 수 있다.<br>④ 반품상품의 회수는 "${data.supplierName || '□□□'}"의 요청에 따르며 이외 결정되지 않은 사항은 양사가 협의하여 결정한다.</div>

  <div class="style-subtitle">▪제 6 조 (판매수수료율)</div>
  <div class="style-body">① (주) 교보문고가 상품의 판매대금에서 공제할 수 있는 판매수익은 상품의 판매대금에 [별첨1]에서 정하는 판매수수료율을 곱한 금액으로 한다. 이때 판매대금이라 함은 판매대금에 포함되어 있는 부가가치세를 포함한 총판매액을 말한다.<br>② (주) 교보문고는 정당한 사유 없이 계약기간 중에 제①항의 판매수수료율을 변경하지 아니한다.<br>③ (주) 교보문고 또는 "${data.supplierName || '□□□'}"이 계약기간의 만료에 따라 판매수수료율을 변경하려는 경우에는 계약기간의 만료일로부터 7일전까지 변경을 희망하는 마진율 및 변경사유를 상대방에게 서면으로 통보한 후 시장상황 등을 고려해서 상호 협의하여 결정한다.</div>

  <div class="style-subtitle">▪제 7 조 (판촉사원 파견 등)</div>
  <div class="style-body">① (주) 교보문고는 원칙적으로 판촉사원 파견을 받지 않으나, 비용 부담 주체 및 파견 사유에 따라 예외적으로 허용될 수 있다.<br>&nbsp;&nbsp;1. (주) 교보문고가 비용을 부담하는 경우<br>&nbsp;&nbsp;2. "${data.supplierName || '□□□'}"(이)가 예상이익 등을 고려하여 자발적으로 요청하는 경우<br>&nbsp;&nbsp;3. 특수한 판매기법이 필요한 경우<br>&nbsp;&nbsp;4. 전문지식이 중요한 상품류를 판매ㆍ관리하기 위한 경우<br>② 제①항 단서에 해당하는 경우 사전합의 후 판촉사원을 파견하며, (주) 교보문고의 고유업무에 종사해서는 안 된다.<br>③ 파견된 판촉사원은 해당 상품의 판매 및 관련 업무에 종사한다.<br>④ 인건비 등 제반 비용은 사유 및 예상이익을 고려하여 협의 부담한다.<br>⑤ "${data.supplierName || '□□□'}" (은)는 판매촉진을 위하여 본 매장 이외에 단기행사 참여 또는 정기할인행사 시 추가로 판촉사원을 운영할 수 있다. 단, 추가 운영 인원은 사전에 별도로 협의하여 결정한다.<br>⑥ 근무기간은 본 계약 유효기간으로 한다.<br>⑦ 지정 영업점 외 장소 파견 시 별도 협의한다.</div>

  <div class="style-subtitle">▪제 8 조 (서비스 품질유지)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}" 또는 파견한 판촉사원은 (주) 교보문고가 기대하는 수준 이상의 서비스 품질이 유지될 수 있도록 노력하여야 한다.<br>② "${data.supplierName || '□□□'}" (은)는 고객의 정당한 불만이 있을 경우 즉시 필요한 조치를 강구하여 시행하여야 한다.<br>③ 고객불만 해결 비용은 원인의 소재, 과실의 유무 등을 종합적으로 고려하여 상호 협의하여 분담한다.</div>

  <div class="style-subtitle">▪제 9 조 (광고활동 및 비용부담)</div>
  <div class="style-body">① (주) 교보문고는 "${data.supplierName || '□□□'}" 의 의사에 반하여 광고비 등의 비용을 부당하게 징구하거나 전가하지 않는다.<br>② (주) 교보문고가 시행하는 단체광고, 판촉활동 등에 소요되는 비용에 대해서는 수익자 부담원칙에 의거하여 (주) 교보문고와 "${data.supplierName || '□□□'}" (이)가 각각 적정하게 부담한다.<br>③ "${data.supplierName || '□□□'}" (은)는 각종 매체를 통한 브랜드 홍보 활동 시 사전에 (주) 교보문고와 합의 후 진행할 수 있다.<br>④ (주) 교보문고가 "${data.supplierName || '□□□'}"에게 판촉비용을 부담시키는 경우 사전에 서면으로 약정하여야 한다.</div>

  <div class="style-subtitle">▪제 10 조 (판촉행사 참여 등)</div>
  <div class="style-body">① 판매촉진을 위한 행사나 활동을 하려면 사전에 다음 각 호의 사항이 명시된 서면으로 합의를 한 후 진행한다.<br>&nbsp;&nbsp;1. 명칭ㆍ성격ㆍ기간<br>&nbsp;&nbsp;2. 판매할 상품의 품목<br>&nbsp;&nbsp;3. 소요될 것으로 예상되는 비용의 규모 및 사용내역<br>&nbsp;&nbsp;4. 직접적으로 얻을 것으로 예상되는 경제적 이익의 비율<br>&nbsp;&nbsp;5. 판촉비용의 분담비율 또는 액수<br>② (주) 교보문고는 정당한 사유 없이 판촉행사에 참여하게 하거나 광고를 하게 하지 아니한다.<br>③ 가격인하 등 할인판매 시 매출액 감소분의 분담 비율은 합의하여 결정하며, 별도의 합의가 없을 경우는 5 : 5 분담을 원칙으로 한다.<br>④ 단기행사라 함은 1개월 이하의 행사를 의미한다.<br>⑤ 차별화되는 판촉행사를 실시하려는 경우에는 상호 협의하여 판촉비용의 분담비율을 정할 수 있다.</div>

  <div class="style-subtitle">▪제 11 조 (매장 위치 및 면적, 매장 내 인테리어 변경 등)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"의 점포명, 운영층, 매장위치, 매장면적은 [별첨3] 매장의 위치 등과 같다.<br>② "${data.supplierName || '□□□'}" (은)는 사유로 매장 내 인테리어가 필요한 경우 협의하여 "${data.supplierName || '□□□'}"의 비용으로 변경할 수 있다.<br>③ "${data.supplierName || '□□□'}" (은)는 사전동의를 득한 후 고정시설의 비품, 매대, 집기 등을 추가로 설치할 수 있다.<br>④ 계약 종료 시 "${data.supplierName || '□□□'}" 의 소유물을 반출하여 원상복구하여야 한다.<br>⑤ MD 개편 등 정당한 사유가 있는 경우 매장의 위치를 변경할 수 있다. 단, 비용이 발생 할 경우 사전 협의하여 분담비율을 결정한다.</div>

  <div class="style-subtitle">▪제 12 조 (매대사용료 등)</div>
  <div class="style-body">"${data.supplierName || '□□□'}"(은)는 원활한 행사진행을 위해 부득이하게 (주) 교보문고 소유의 매대를 단기대여하여 점포 내 행사를 진행 할 경우 다음의 기준에 의해 매대 사용료가 발생 될 수 있다.<br>&nbsp;&nbsp;1. 대상점포는 광화문점으로 한정한다.<br>&nbsp;&nbsp;2. 매대사용 여부는 행사 시작 전 협의하여 결정한다.<br>&nbsp;&nbsp;3. 매대사용료 발생 시 세금계산서를 발행하며 상품대금에서 공제한다.</div>

  <div class="style-subtitle">▪제 13 조 (영업 및 인·허가)</div>
  <div class="style-body">① 허가받지 아니한 상품을 판매할 수 없다.<br>② "${data.supplierName || '□□□'}" 의 귀책사유로 인하여 발생하는 제반 문제 및 분쟁에 대하여 책임을 진다.<br>③ 표시 기준 위반 등으로 인한 법적 책임은 "${data.supplierName || '□□□'}" (이)가 부담한다.<br>④ 귀책사유로 인하여 (주) 교보문고가 입은 손해에 대해 전액 배상하여야 한다.</div>

  <div class="style-subtitle">▪제 14 조 (통지의무)</div>
  <div class="style-body">양 당사자는 다음 각호에 해당되는 사실이 발생된 경우에는 지체없이 서면으로 통지하여야 한다.<br>&nbsp;&nbsp;1. 주소, 상호, 대표자 등 사업자등록증에 명시된 사항이 변경된 경우<br>&nbsp;&nbsp;2. 정관이 변경된 경우<br>&nbsp;&nbsp;3. 자본구성에 중대한 변경이 있는 경우<br>&nbsp;&nbsp;4. 개인사업자가 법인으로 변경되거나 법인이 개인사업자로 변경된 경우<br>&nbsp;&nbsp;5. 기타 중대한 변경이 있는 경우</div>

  <div class="style-subtitle">▪제 15 조 (사후고객관리를 위한 조치)</div>
  <div class="style-body">① 매장 철수 후 고객 관리를 위해 계약 종료 직전 월 판매대금의 10%를 예치하게 할 수 있다.<br>② 보증금 미예치 상태에서 비용 지출 시 "${data.supplierName || '□□□'}"(은)는 이를 지급한다.<br>③ 예치금 유효기간은 계약 종료일로부터 3개월간으로 한다.</div>

  <div class="style-subtitle">▪제 16 조 (손해배상)</div>
  <div class="style-body">① 고의 또는 과실로 손해를 입힌 경우 즉시 배상하거나 원상 복구하여야 한다.<br>② 관계법령 위반 시 민·형사상의 책임을 진다.<br>③ 제조물책임법상의 결함으로 인한 손해 발생 시 손해배상 책임을 부담한다.</div>

  <div class="style-subtitle">▪제 17 조 (상계)</div>
  <div class="style-body">① 계약 종료 시 채무를 대등액에서 상계할 수 있다.<br>② 압류 등이 송달된 경우 기한의 이익을 상실하며 상계할 수 있다.<br>③ 손해배상채권과 채무를 상계할 수 있다.</div>

  <div class="style-subtitle">▪제 18 조 (권리의 양도)</div>
  <div class="style-body">① 사전 승인 없이 권리, 의무 등을 제3자에게 양도 또는 이전할 수 없다.<br>② 사전 승인 없이 채권을 양도할 수 없다. 단, 금전채권은 사전 통지 후 가능하다.</div>

  <div class="style-subtitle">▪제 19 조 (계약 해지)</div>
  <div class="style-body">① 다음 각 호의 사유 발생 시 해지할 수 있다.<br>&nbsp;&nbsp;1. 어음/수표 지급거절, 회생/파산 절차 신청<br>&nbsp;&nbsp;2. 주요재산 강제경매<br>&nbsp;&nbsp;3. 생산 중단 또는 종료<br>&nbsp;&nbsp;4. 관계법령 저촉, 라이선스 종료<br>② 계약 위반 시 14일 이상의 기간을 정해 시정 요구 후, 불이행 시 해지할 수 있다.<br>③ 부득이한 사유로 해지 시 1개월 전까지 서면 통지하여야 한다.<br>④ 귀책 당사자는 손해를 배상하여야 한다.</div>

  <div class="style-subtitle">▪제 20 조 (계약 유효기간 및 갱신)</div>
  <div class="style-body">① 본 계약의 유효기간은 ${data.tradeStartDate || '2025/02/01'}부터 ${data.tradeEndDate || '2025/04/30'}까지 ${data.tradePeriod || '3개월'}간으로 한다.<br>② 만료 1개월 전까지 별도의 의사표시가 없는 경우 동일한 조건으로 자동 연장된다.</div>

  <div class="style-subtitle">▪제 21 조 (윤리경영을 위한 협약)</div>
  <div class="style-body">(주) 교보문고 또는 "${data.supplierName || '□□□'}" (각 피고용인 포함)(은)는 상거래 시에 다음 사항을 준수하여야 한다.<br>① (주) 교보문고: 부당 이익 취득 금지, 부당 요구 금지, 공정 거래 준수<br>② "${data.supplierName || '□□□'}": 금품 제공 금지, 품질/서비스 책임, 기업윤리 준수<br>③ 위반 시: 피고용인 징계 조치, 1차 경고, 2차 거래중단 조치 가능</div>

  <div class="style-subtitle">▪제 22 조 (변경ㆍ수정 및 해석)</div>
  <div class="style-body">① 서면합의로만 변경ㆍ수정할 수 있으며, 기명ㆍ날인(서명)함과 동시에 효력이 발생한다.<br>② 이견이 있을 시는 상호협의하고, 합의가 되지 아니한 경우 관련법규 및 상관례에 따른다.</div>

  <div class="style-subtitle">▪제 23 조 (분쟁의 해결)</div>
  <div class="style-body">① 관할법원은 거래가 이루어지는 당해 (주) 교보문고의 사업장 소재지의 관할 법원으로 한다.<br>② 다수인 경우 거래규모가 가장 큰 사업장 소재지의 관할 법원을 원칙으로 하되, 합의하여 결정할 수 있다.</div>

  <div class="style-subtitle">▪제 24 조 (보칙)</div>
  <div class="style-body">기존 거래약정서는 효력을 상실하며, 별도 합의서 등은 본 계약서와 동일한 효력을 갖는다. 단, 불일치가 있는 경우 최근 문서가 우선한다.</div>

  <br>
  <div class="style-bodyr" style="margin-top: 20px; margin-bottom: 20px;">
    본 계약을 증명하기 위하여 (주) 교보문고, "${data.supplierName || '□□□'}" 쌍방은 상기 계약조항을 확인하고 기명ㆍ날인(서명)하여 각각 1통씩 보관한다.
  </div>

  <div class="style-attachment" style="page-break-before: always;">▪별첨 1. 취급품목 및 판매수수료 약정서</div>
  <div class="style-body">(주) 교보문고와 "${data.supplierName || '□□□'}"(은)는 본 계약서 제1조 ②항에 따라 취급브랜드와 판매수수료에 대해 다음과 같이 약정한다.</div>
  
<div class="style-body">1. 취급품목 및 판매수수료율</div>
<table class="contract-table editable-table" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th contenteditable="true" style="border: 1px solid #000; padding: 8px;">점포명</th>
      <th contenteditable="true" style="border: 1px solid #000; padding: 8px;">카테고리</th>
      <th contenteditable="true" style="border: 1px solid #000; padding: 8px;">거래품목</th>
      <th contenteditable="true" style="border: 1px solid #000; padding: 8px;">취급브랜드</th>
      <th contenteditable="true" style="border: 1px solid #000; padding: 8px;">수수료</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.storeName || '점포명 미입력'}</td>
      <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.category || '카테고리 미입력'}</td>
      <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.items || '거래품목 미입력'}</td>
      <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.brand || '취급브랜드 미입력'}</td>
      <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.commission || '00'}%</td>
    </tr>
  </tbody>
</table>

  <div class="style-body">2. 행사판매수수료<br>&nbsp;&nbsp;- (주) 교보문고와 "${data.supplierName || '□□□'}"(은) 행사 진행 시 사전 협의를 통해 수수료를 결정하며, 별도 약정이 필요할 경우 약정하여 결정한다.</div>
  <div class="style-body">3. "${data.supplierName || '□□□'}"(은)는 제1항의 거래품목 및 취급브랜드에 대한 원활한 상품 공급을 위해 노력하여야 하며, 거래품목 및 취급브랜드의 공급이 중단될 경우 서면으로 통보하고 "취급브랜드 합의서"를 갱신하여야 한다.</div>

  <div class="style-attachment" style="margin-top: 40px; page-break-before: auto !important;">▪별첨 2. 판촉사원 약정서</div>
  <div class="style-body">(주) 교보문고와 "${data.supplierName || '□□□'}" (이하 "${data.supplierName || '□□□'}")은(는) "${data.supplierName || '□□□'}"가 자사의 상품 홍보 및 매출증대를 위해 ‘(주) 교보문고’에게 판촉사원을 파견하는 사안과 관련하여 다음과 같이 약정을 체결한다.</div>

  <div class="style-subtitle">제 1 조 (목적)</div>
  <div class="style-body">본 약정서는 "${data.supplierName || '□□□'}"가 ‘(주) 교보문고’에 공급하는 상품에 관한 홍보 및 판매 촉진을 위하여 ‘(주) 교보문고’의 매장에 판촉사원을 파견함에 있어 쌍방의 권리와 의무를 정함에 그 목적이 있다.</div>

  <div class="style-subtitle">제 2 조 (기본사항)</div>
  <div class="style-body">① 파견인원</div>
  <table class="contract-table editable-table" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid #000; padding: 4px;">구분</th><th style="border: 1px solid #000; padding: 4px;">운영층</th><th style="border: 1px solid #000; padding: 4px;">인원수</th>
        <th style="border: 1px solid #000; padding: 4px;">구분</th><th style="border: 1px solid #000; padding: 4px;">운영층</th><th style="border: 1px solid #000; padding: 4px;">인원수</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #000;">광화문점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">강남점</td><td style="border: 1px solid #000;">B1F~B2F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">대구점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">잠실점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">창원점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">부산점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">천안점</td><td style="border: 1px solid #000;">4F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">목동점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">영등포점</td><td style="border: 1px solid #000;">2F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">수유점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">디큐브시티점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">판교점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">전주점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">동대문점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">울산점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">일산점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">송도점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">대전점</td><td style="border: 1px solid #000;">3F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">센텀시티점</td><td style="border: 1px solid #000;">7F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">은평점</td><td style="border: 1px solid #000;">3F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">청량리점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">합정점</td><td style="border: 1px solid #000;">B1F~B2F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">가든파이브점</td><td style="border: 1px solid #000;">4F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">평촌점</td><td style="border: 1px solid #000;">6F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">분당점</td><td style="border: 1px solid #000;">B2F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">광교점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">천호점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;">거제디큐브</td><td style="border: 1px solid #000;">8F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000;">건대스타시티점</td><td style="border: 1px solid #000;">B1F</td><td contenteditable="true" style="border: 1px solid #000;">명</td>
        <td style="border: 1px solid #000;"></td><td style="border: 1px solid #000;"></td><td style="border: 1px solid #000;"></td>
      </tr>
    </tbody>
  </table>
  <div class="style-body">② 파견기간 : 점포별 계약기간에 따름<br>③ 근무시간 : 점포별 영업시간에 따름(주중8시간, 주말7시간 근무)<br>④ 근무장소 : "${data.supplierName || '□□□'}"이(가) 납품한 상품의 판매장소(해당점)</div>

  <div class="style-subtitle">제 3 조 (판촉사원의 업무범위)</div>
  <div class="style-body">"${data.supplierName || '□□□'}"의 판촉사원은 ‘(주) 교보문고’의 매장에서 다음의 업무를 수행한다.<br>① "${data.supplierName || '□□□'}"이(가) 납품한 자사제품의 판매업무<br>② "${data.supplierName || '□□□'}"이(가) 납품한 자사제품의 보관 및 관리업무</div>

  <div class="style-subtitle">제 4 조 (판촉사원의 채용 및 업무수행)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"은(는) 판촉사원의 채용시 ‘(주) 교보문고’가 정하는 소정의 절차에 따라 ‘(주) 교보문고’와 사전협의를 한다.<br>② 판촉사원은 "${data.supplierName || '□□□'}"의 고용인으로서 "${data.supplierName || '□□□'}"의 지시에 따라 업무를 수행한다.</div>

  <div class="style-subtitle">제 5 조 (비용분담 및 조건)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"은(는) "${data.supplierName || '□□□'}"의 부담으로 판촉사원을 파견하며, 파견에 따른 예상이익은 아래와 같다.</div>
  <table class="contract-table editable-table" style="width: 100%; border-collapse: collapse;">
    <thead><tr><th style="border: 1px solid #000;">예상매출</th><th style="border: 1px solid #000;">예상비용</th><th style="border: 1px solid #000;">예상수익</th><th style="border: 1px solid #000;">비고</th></tr></thead>
    <tbody><tr><td contenteditable="true" style="border: 1px solid #000; height:30px;"></td><td contenteditable="true" style="border: 1px solid #000;"></td><td contenteditable="true" style="border: 1px solid #000;"></td><td contenteditable="true" style="border: 1px solid #000;"></td></tr></tbody>
  </table>
  <div class="style-body">* 산출근거 : 예상비용 = (${data.supplierName || '□□□'}) 원가 + 마케팅비용 + 인건비<br>② "${data.supplierName || '□□□'}"은(는) 판촉사원의 사용자로서 부담하여야 할 비용을 부담한다.<br>③ 기타 발생하는 비용분담에 대하여는 ‘(주) 교보문고’와 "${data.supplierName || '□□□'}"이(가) 합의하여 결정한다.</div>

  <div class="style-subtitle">제 6 조 (기타사항)</div>
  <div class="style-body">① 본 약정은 "${data.supplierName || '□□□'}"의 자발적 파견 요청 및 의사에 의해 작성한다.<br>② 본 약정서의 체결 또는 약정서상의 업무수행으로 인하여 "${data.supplierName || '□□□'}"의 판촉사원과 ‘(주) 교보문고’사이에 고용관계가 형성되는 것으로는 해석되지 아니한다.<br>③ 본 약정서에 정하지 아니한 세부적인 사항은 쌍방의 별도 협의로 결정하거나, 일반 상관례에 따른다.</div>

  <div class="style-attachment" style="margin-top: 40px; page-break-before: auto !important;">▪별첨 3. 매장의 위치 등</div>
  <div class="style-body">1. 매장위치</div>
  <table class="contract-table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
    <thead>
      <tr><th style="border: 1px solid #000;">구분</th><th style="border: 1px solid #000;">점포명</th><th style="border: 1px solid #000;">사업장 소재지</th></tr>
    </thead>
    <tbody>
      <tr><td style="border: 1px solid #000;">1</td><td style="border: 1px solid #000;">광화문점</td><td style="border: 1px solid #000;">서울시 종로구 종로 1(종로1가) 교보생명빌딩 B1</td></tr>
      <tr><td style="border: 1px solid #000;">2</td><td style="border: 1px solid #000;">강남점</td><td style="border: 1px solid #000;">서울시 서초구 강남대로 465(서초동) 교보타워 B2</td></tr>
      <tr><td style="border: 1px solid #000;">3</td><td style="border: 1px solid #000;">동대문점</td><td style="border: 1px solid #000;">서울시 중구 장충단로13길 20 현대시티아울렛 동대문점 B1</td></tr>
      <tr><td style="border: 1px solid #000;">4</td><td style="border: 1px solid #000;">디큐브시티점</td><td style="border: 1px solid #000;">서울시 구로구 경인로 662 디큐브백화점 B1 교보문고</td></tr>
      <tr><td style="border: 1px solid #000;">5</td><td style="border: 1px solid #000;">목동점</td><td style="border: 1px solid #000;">서울시 양천구 목동서로 159-1(목동) CBS빌딩 B1</td></tr>
      <tr><td style="border: 1px solid #000;">6</td><td style="border: 1px solid #000;">영등포점</td><td style="border: 1px solid #000;">서울시 영등포구 영중로 15(영등포동4가) 타임스퀘어 2F</td></tr>
      <tr><td style="border: 1px solid #000;">7</td><td style="border: 1px solid #000;">은평점</td><td style="border: 1px solid #000;">서울시 은평구 통일로 1050(진관동 63), 롯데몰 은평점 3F</td></tr>
      <tr><td style="border: 1px solid #000;">8</td><td style="border: 1px solid #000;">수유점</td><td style="border: 1px solid #000;">서울시 강북구 도봉로 348(번동) 교보생명빌딩 B1</td></tr>
      <tr><td style="border: 1px solid #000;">9</td><td style="border: 1px solid #000;">잠실점</td><td style="border: 1px solid #000;">서울시 송파구 올림픽로 269(신천동) 롯데캐슬골드 B1</td></tr>
      <tr><td style="border: 1px solid #000;">10</td><td style="border: 1px solid #000;">청량리점</td><td style="border: 1px solid #000;">서울시 동대문구 왕산로 214, 롯데백화점 B1</td></tr>
      <tr><td style="border: 1px solid #000;">11</td><td style="border: 1px solid #000;">합정점</td><td style="border: 1px solid #000;">서울시 마포구 월드컵로1길 14 딜라이트스퀘어 A동 B2</td></tr>
      <tr><td style="border: 1px solid #000;">12</td><td style="border: 1px solid #000;">가든파이브점</td><td style="border: 1px solid #000;">서울시 송파구 충민로 66 가든파이브 현대시티몰 4F</td></tr>
      <tr><td style="border: 1px solid #000;">13</td><td style="border: 1px solid #000;">광교월드센터</td><td style="border: 1px solid #000;">경기도 수원시 영통구 센트럴타운로 107, 광교 월드스퀘어 B1</td></tr>
      <tr><td style="border: 1px solid #000;">14</td><td style="border: 1px solid #000;">송도점</td><td style="border: 1px solid #000;">인천시 연수구 송도국제대로 123 현대백화점 프리미엄아울렛 송도점 B1</td></tr>
      <tr><td style="border: 1px solid #000;">15</td><td style="border: 1px solid #000;">일산점</td><td style="border: 1px solid #000;">경기도 고양시 일산동구 중앙로 1036 고양터미널 B1</td></tr>
      <tr><td style="border: 1px solid #000;">16</td><td style="border: 1px solid #000;">판교점</td><td style="border: 1px solid #000;">경기도 성남시 분당구 판교역로 146번길 20 (백현동) 현대백화점 B2</td></tr>
      <tr><td style="border: 1px solid #000;">17</td><td style="border: 1px solid #000;">평촌점</td><td style="border: 1px solid #000;">경기도 안양시 동안구 시민대로 180 롯데백화점 평촌점 6F</td></tr>
      <tr><td style="border: 1px solid #000;">18</td><td style="border: 1px solid #000;">대전점</td><td style="border: 1px solid #000;">대전시 서구 대덕대로 226, 명동프라자 3F</td></tr>
      <tr><td style="border: 1px solid #000;">19</td><td style="border: 1px solid #000;">세종점</td><td style="border: 1px solid #000;">세종특별자치시 갈매로 363, 세종파이낸스센터 1차</td></tr>
      <tr><td style="border: 1px solid #000;">20</td><td style="border: 1px solid #000;">천안점</td><td style="border: 1px solid #000;">천안시 동남구 만남로 43(신부동) 신세계백화점 신관 3F</td></tr>
      <tr><td style="border: 1px solid #000;">21</td><td style="border: 1px solid #000;">전주점</td><td style="border: 1px solid #000;">전주시 완산구 전주객사 5길 35 NC 웨이브 전주 객사점 B관 B1</td></tr>
      <tr><td style="border: 1px solid #000;">22</td><td style="border: 1px solid #000;">대구점</td><td style="border: 1px solid #000;">대구시 중구 국채보상로 586(동성로2가) 교보생명빌딩 B1</td></tr>
      <tr><td style="border: 1px solid #000;">23</td><td style="border: 1px solid #000;">칠곡센터</td><td style="border: 1px solid #000;">대구시 북구 동암로 104 (동천동) 동천빌딩 3F</td></tr>
      <tr><td style="border: 1px solid #000;">24</td><td style="border: 1px solid #000;">부산점</td><td style="border: 1px solid #000;">부산시 부산진구 중앙대로 658(부전동, 교보생명빌딩 B1)</td></tr>
      <tr><td style="border: 1px solid #000;">25</td><td style="border: 1px solid #000;">센텀시티점</td><td style="border: 1px solid #000;">부산시 해운대구 센텀남대로 59, 롯데백화점 센텀시티점 7층</td></tr>
      <tr><td style="border: 1px solid #000;">26</td><td style="border: 1px solid #000;">울산점</td><td style="border: 1px solid #000;">울산시 남구 화합로 185 업스퀘어 B1</td></tr>
      <tr><td style="border: 1px solid #000;">27</td><td style="border: 1px solid #000;">창원점</td><td style="border: 1px solid #000;">창원시 성산구 중앙대로 104(상남동) 마이우스빌딩 B1</td></tr>
      <tr><td style="border: 1px solid #000;">28</td><td style="border: 1px solid #000;">경성대,부경대센터</td><td style="border: 1px solid #000;">부산시 남구 수영로 324(대연동), 리마크빌 B2</td></tr>
      <tr><td style="border: 1px solid #000;">29</td><td style="border: 1px solid #000;">분당점</td><td style="border: 1px solid #000;">성남시 분당구 황새울로312번길 26,센트럴타워 B1</td></tr>
      <tr><td style="border: 1px solid #000;">30</td><td style="border: 1px solid #000;">광교점</td><td style="border: 1px solid #000;">경기도 수원시 영통구 광교중앙로 145, 광교 엘포트몰 B1</td></tr>
      <tr><td style="border: 1px solid #000;">31</td><td style="border: 1px solid #000;">광주상무센터</td><td style="border: 1px solid #000;">광주광역시 서구 상무중앙로 58(치평동) 광주 타임스퀘어 3F</td></tr>
      <tr><td style="border: 1px solid #000;">32</td><td style="border: 1px solid #000;">천호점</td><td style="border: 1px solid #000;">서울시 강동구 올림픽로 664, 대우한강 베네시티 B1</td></tr>
      <tr><td style="border: 1px solid #000;">33</td><td style="border: 1px solid #000;">거제디큐브</td><td style="border: 1px solid #000;">경남 거제시 장평로 12 디큐브백화점 8F</td></tr>
      <tr><td style="border: 1px solid #000;">34</td><td style="border: 1px solid #000;">건대스타시티점</td><td style="border: 1px solid #000;">서울특별시 광진구 능동로 92 B1</td></tr>
    </tbody>
  </table>
  <div class="style-body">2. 매장면적 : [별첨1] 1항 해당점포의 카테고리 코너 內 합의 된 공간<br>3. 기타사항 : (주) 교보문고의 운영점포의 신규점포개설 및 폐점이 있을 경우 (주) 교보문고는 서면(전자우편포함)또는 협력사네트워크[SCM](https://scm.kyobobook.co.kr/)를 통해 안내한다.</div>

  <div class="signature-section" style="margin-top: 50px;">
    <div class="style-bodycenter" style="margin-bottom: 30px;">${data.contractDate || '계약일자 미입력'}</div>
    
    <div class="signature-row">
      <div class="signature-party">
        <div class="signature-field">
          <span>서울특별시 종로구 종로 1 (종로 1가, 교보빌딩)</span>
        </div>
        <div class="signature-field">
          <span>(주) 교보문고</span>
        </div>
        <div class="signature-field">
          <span class="signature-label">대표이사</span>
          <span>안병현</span>
        </div>
      </div>
      
      <div class="signature-party">
        <div class="signature-field">
          <span>${data.address || '주소 미입력'}</span>
        </div>
        <div class="signature-field">
          <span>${data.supplierName || '업체명 미입력'}</span>
        </div>
        <div class="signature-field">
          <span class="signature-label">대표이사</span>
          <span>${data.ceo || '대표자 미입력'}</span>
        </div>
      </div>
    </div>
  </div>
</div>
`;