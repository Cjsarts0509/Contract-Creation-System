import { ContractData } from './contractTemplates';

// [최종 수정] 직매입 계약서 (별첨1-2 연결 인쇄 버그 수정)
export const directPurchaseTemplate = (data: ContractData) => `
<div class="contract-page contract-paper">
  <div class="style-title">직매입 거래계약서</div>

  <div class="style-bodycenter">(주)교보문고와 "${data.supplierName || '□□□'}"(을)는 다음과 같이 계약을 체결한다.</div>

  <div class="style-subtitle">▪제 1 조 (목적)</div>
  <div class="style-body">이 계약서의 작성 목적은 (주)교보문고와 "${data.supplierName || '□□□'}" 간 상품의 직매입거래((주) 교보문고가 매입한 상품 중 판매하지 아니한 상품에 대한 반품이 불가능하고 "${data.supplierName || '□□□'}"으로부터 상품을 매입하는 형태의 거래를 말한다)에서 양 당사자 사이의 기본적인 권리와 의무를 정하기 위함에 있다.</div>

  <div class="style-subtitle">▪제 2 조 (상품납품 등)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"이 (주) 교보문고에게 공급하는 상품의 브랜드는 [별첨 1] 취급 브랜드 협의서에 따른다.<br>② (주) 교보문고는 협력사네트워크[SCM](https://scm.kyobobook.co.kr/)을 통해 상품의 종류, 수량 및 가격, 납품장소를 지정하여 "${data.supplierName || '□□□'}"에게 발주한다. 상품의 종류, 수량 및 가격과 납품장소는 발주의뢰서, 매입전표, 세금계산서 등으로 대신할 수 있다.<br>③ "${data.supplierName || '□□□'}"은 제 2 항의 발주일로부터 3 일 이내에 지정된 장소에 바코드를 부착한 상품을 공급하여야 한다. 단, 부득이한 사유로 3 일 이내에 공급이 불가능한 경우에는 해당 기일의 전일까지 (주) 교보문고에게 납품기한의 연장을 요청하여 사전 승인을 받아야 한다.<br>④ "${data.supplierName || '□□□'}"(을)는 "원산지표시" 및 "어린이제품안전특별법", "전기용품 및 생활용품 안전관리법"에 의한 품질관리서를 부착하여 관계법령 및 상호 합의한 품질기준을 유지하여야 하며, 전기용품 및 생활용품 안전관리법, 어린이제품안전특별법, 대외무역법, 원산지표시법, 식품위생법, 표시광고법 등 관계법률을 준수한 상품을 공급하여야 한다. 만약 이를 어기고 판매하여 문제가 발생할 경우 "${data.supplierName || '□□□'}"(을)는 당해 위반행위로 인하여 발생한 (주) 교보문고의 손해액((주) 교보문고에게 부과된 벌금 또는 과태료 및 고객 보상과 관련된 제반비용 일체)을 전액 배상하여야 한다.<br>⑤ "${data.supplierName || '□□□'}"(을)는 (주) 교보문고가 발주하는 품목별 규격별 수량을 (주) 교보문고 또는 (주) 교보문고의 지정인에게 공급함에 있어, (주) 교보문고의 납품 규정에 의거하여 공급을 완료하여야 한다.<br>⑥ (주)교보문고와 "${data.supplierName || '□□□'}"(을)는 효율적인 물류시스템 구축을 통한 물류 선진화를 위해 상호 협조한다.</div>

  <div class="style-subtitle">▪제 3 조 (검수기준 및 품질검사)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"은 납품하는 상품에 관하여 (주) 교보문고의 검수기준에 따른 검수를 받아야 한다.<br>② (주) 교보문고는 상품의 공급, 규격, 관련 법령의 허용기준 등 "${data.supplierName || '□□□'}"이 납품하는 상품에 관한 검수기준을 사전에 "${data.supplierName || '□□□'}"에게 서면(전자문서 포함)으로 제시하여야 한다.<br>③ (주) 교보문고는 "${data.supplierName || '□□□'}"이 납품하는 상품에 대하여 품질검사 및 성분검사가 필요한 경우 "${data.supplierName || '□□□'}"에게 해당 검사를 요구할 수 있다. 이 경우 "${data.supplierName || '□□□'}"은 공인된 검사기관으로부터 검사를 받은 후 검사결과를 해당 상품의 납품전에 (주) 교보문고에게 제출하며, 검사비용은 "${data.supplierName || '□□□'}"이 부담한다. 단, 그 검사결과 "${data.supplierName || '□□□'}"이 납품한 상품이 법적 기준을 충족하여 합격 또는 적합 판정을 받은 경우로서 다음 각 호의 어느 하나에 해당하는 경우에는 (주) 교보문고가 검사비용을 부담한다.<br>&nbsp;&nbsp;가. "${data.supplierName || '□□□'}"이 제 3 항 본문에 따른 검사 이전에 이미 해당 상품에 대한 적절한 품질검사 또는 성분검사 등을 거쳐 이미 합격 또는 적합 판정을 받은 경우<br>&nbsp;&nbsp;나. 상품의 특성상 추가적인 공인기관의 검사를 거치지 않더라도 해당 상품의 품질적합 여부가 외관상 뚜렷이 판단될 수 있는 등 처음부터 품질검사 및 성분검사가 필요하지 않았다고 인정될 수 있는 경우</div>

  <div class="style-subtitle">▪제 4 조 (납품대금 지급조건 및 지급기일)</div>
  <div class="style-body">① 지급조건 : 현금<br>② 지급기일 : 납품마감일 익월 20 일<br>③ (주) 교보문고는 판매대금을 지급함에 있어 "${data.supplierName || '□□□'}"과 사전합의에 의하여 판매대금으로 지급하는 것으로 대체한다. 또한 (주) 교보문고에게 납품되어야 하는 물품이 공제된 금액만 지급될 수 있으며, 이 경우 (주) 교보문고는 공제 내역을 "${data.supplierName || '□□□'}"에게 고지한다.<br>④ (주) 교보문고는 판매대금을 지급해야하는 날이 공휴일 또는 (주) 교보문고의 휴무일 일 경우 공휴일 또는 휴무일 익일에 지급한다.</div>

  <div class="style-subtitle">▪제 5 조 (반품)</div>
  <div class="style-body">① (주) 교보문고는 검품결과 파손, 오손, 훼손 또는 규격 상이, 변질 등 상품에 하자가 있는 경우 상품납입일로부터 30 일 이내에 반품할 수 있다. 다만, 상품납품일에 위 하자를 외견상 즉시 발견할 수 없는 사유가 있는 경우라면 상호 합의 하에 그 기간을 연장할 수 있다.<br>② (주) 교보문고는 신·구상품의 교체, 시장테스트 상품의 반품 등 "${data.supplierName || '□□□'}"(이)가 자기에게 독자적으로 이익이 된다고 판단하여 요구한 사유로 요청한 반품을 수용할 수 있다. 이 경우 해당 반품이 자기에게 직접적으로 이익이 된다는 객관적인 근거자료를 (주) 교보문고에게 제출한다.<br>③ "${data.supplierName || '□□□'}"(을)는 발주 및 계약수량을 초과한 상품, "${data.supplierName || '□□□'}"의 귀책사유로 계약이 해지된 상품, 또는 제①항과 제②항에 해당되어 (주) 교보문고으로부터 반품되는 상품을 자신의 부담으로 즉시 회수하여야 한다.<br>④ (주) 교보문고는 "${data.supplierName || '□□□'}"(이)가 제③항을 성실히 이행하지 않을 시, "${data.supplierName || '□□□'}"의 부담으로 상품을 반송하거나 기타 필요한 조치를 취할 수 있다.<br>⑤ 다음 각호의 행사가 종료된 후 매입한 상품은 시즌 행사 종료 후 반품할 수 있다.<br>&nbsp;&nbsp;가. 선물시즌 : 발렌타인데이/화이트데이, 5 월 가정의 날, 크리스마스 시즌 등<br>&nbsp;&nbsp;나. 행사시즌 : 신학기, 여름방학/겨울방학, 연말 다이어리시즌 등<br>⑥ 세부 반품기준은 [별첨 2] 반품약정서를 따른다.</div>

  <div class="style-subtitle">▪제 6 조 (판매장려금)</div>
  <div class="style-body">"${data.supplierName || '□□□'}"(이)가 공급하는 상품의 판매 신장을 도모하기 위하여 별도 협의하는 바에 따라 "${data.supplierName || '□□□'}"(을)는 (주) 교보문고에게 판매장려금을 지급할 수 있다.</div>

  <div class="style-subtitle">▪제 7 조 (판촉사원파견 등-점포 내 운영에 한함)</div>
  <div class="style-body">① (주) 교보문고는 "${data.supplierName || '□□□'}"으로부터 "${data.supplierName || '□□□'}"의 종업원이나 "${data.supplierName || '□□□'}"이 고용한 인력(이하 "판촉사원"이라 한다)을 파견 받아 근무하게 하거나, (주) 교보문고가 그 판촉사원에 대한 인건비 등을 "${data.supplierName || '□□□'}"에게 부담하게 하지 아니한다. 다만, 다음 각 호의 어느 하나에 해당하는 경우에는 (주) 교보문고는 "${data.supplierName || '□□□'}"의 판촉사원을 "${data.supplierName || '□□□'}" 이 납품하는 상품의 판매 및 관리 업무에 종사하게 할 수 있다.<br>&nbsp;&nbsp;가. (주) 교보문고가 파견된 판촉사원의 인건비, 식대 등 각종 경비, 상품의 판매 및 관련 업무 종사를 위해 소요되는 비용을 부담하는 경우<br>&nbsp;&nbsp;나. "${data.supplierName || '□□□'}"이 판촉사원의 파견에 따른 예상이익과 비용의 내역 및 산출근거를 객관적 · 구체적으로 명시하여 서면 또는 기명날인한 서면에 따라 (주) 교보문고에게 자발적으로 파견을 요청하는 경우<br>&nbsp;&nbsp;다. (주) 교보문고가 특수한 판매기법 또는 능력을 지닌 숙련된 판촉사원을 "${data.supplierName || '□□□'}"으로부터 파견 받는 경우<br>② 판촉사원 운영과 관련한 세부사항은 별도 판촉사원 약정서에 따른다.</div>

  <div class="style-subtitle">▪제 8 조 (광고활동 및 비용부담)</div>
  <div class="style-body">① (주) 교보문고는 "${data.supplierName || '□□□'}"의 의사에 반하여 광고비 등의 비용을 부당하게 징구하거나 전가하지 않는다.<br>② (주) 교보문고가 시행하는 단체광고, 판촉활동 등에 소요되는 비용에 대해서는 수익자 부담원칙에 의거하여 (주) 교보문고와 "${data.supplierName || '□□□'}"(이)가 각각 적절하게 부담한다.<br>③ "${data.supplierName || '□□□'}"(을)는 각종 매체를 통한 브랜드 홍보시, POP제작, 장치 장식, 쇼핑백, 포장지 제작, 온라인몰 광고, 기타 (주)교보문고와 관련된 모든 광고를 하는 경우에는 사전에 (주)교보문고와 협의 후 진행할 수 있다.<br>④ (주) 교보문고는 "${data.supplierName || '□□□'}"에게 판촉비용을 부담시키는 경우 당해 비용의 부담액, 산출근거 및 용도 등을 사전에 이를 명확히 하여 "${data.supplierName || '□□□'}"과 서면으로 약정하여야 한다.</div>

  <div class="style-subtitle">▪제 9 조 (영업 및 인·허가)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"(을)는 (주) 교보문고에게 신규등록 또는 입고 전 허가를 받지 아니한 상품을 판매할 수 없다.<br>② "${data.supplierName || '□□□'}"(을)는 본 계약을 이행함에 있어 "${data.supplierName || '□□□'}"의 상품 판매와 관련하여 발생하는 인·허가 등 "${data.supplierName || '□□□'}"의 귀책사유로 인하여 발생하는 제반 문제 및 분쟁에 대하여 책임을 진다.<br>③ "${data.supplierName || '□□□'}"(을)는 공급 상품 중 관계법령에서 정한 표시 기준(원산지 등)의 위반 또는 미표시로 인한 법적 책임은 "${data.supplierName || '□□□'}"(이)가 부담하기로 한다.<br>④ "${data.supplierName || '□□□'}"(을)는 제②항 및 제③항에 규정한 "${data.supplierName || '□□□'}"의 귀책사유로 인하여 (주) 교보문고가 입은 손해에 대해 전액 배상하여야 한다.</div>

  <div class="style-subtitle">▪제 10 조 (통지의무)</div>
  <div class="style-body">양 당사자는 다음 각호에 해당되는 사실이 발생된 경우에는 지체없이 필요서류를 첨부하여 상대방에게 서면으로 통지하여야 한다.(파트너 포털을 통한 공지 포함)<br>&nbsp;&nbsp;1. 주소, 상호, 대표자 등 사업자등록증에 명시된 사항이 변경된 경우<br>&nbsp;&nbsp;2. 정관이 변경된 경우<br>&nbsp;&nbsp;3. 자본구성에 중대한 변경이 있는 경우<br>&nbsp;&nbsp;4. 개인사업자가 법인으로 변경되거나 법인이 개인사업자로 변경된 경우<br>&nbsp;&nbsp;5. 기타 "${data.supplierName || '□□□'}"에 중대한 변경이 있는 경우</div>

  <div class="style-subtitle">▪제 11 조 (손해배상)</div>
  <div class="style-body">① 양 당사자의 사용인이 고의 또는 과실로 인하여 상대방 또는 제 3 자에게 손해를 입힌 경우에는 당해 당사자는 그 손해를 즉시 배상하거나 원상 복구하여야 한다.<br>② "${data.supplierName || '□□□'}"(을)는 (주) 교보문고에게 공급하는 상품이 관계법령에 위배될 경우 이로 인하여 발생하는 법적 책임은 전적으로 진다.<br>③ "${data.supplierName || '□□□'}"(을)는 "${data.supplierName || '□□□'}"(이)가 제조 또는 공급하는 제조물(상품)의 제조물책임법상의 결함으로 인하여 (주) 교보문고의 고객 또는 제 3 자에게 생명·신체 또는 재산상의 손해가 발생한 경우에는 피해자에 대하여 제조물책임법상의 손해배상 책임을 부담한다.</div>

  <div class="style-subtitle">▪제 12 조 (상계)</div>
  <div class="style-body">① 계약의 해제 · 해지사유가 발생하여 계약이 종료될 경우, 각 당사자는 변제기 도래 여부를 불문하고, 본 계약과 관련하여 발생한 채무를 대등액에서 상계할 수 있다.<br>② 각 당사자가 상대방에게 지급할 채무에 대하여 국세체납에 의한 압류, 가압류, 채권압류 및 추심명령이 송달된 경우, 상대방의 전 채무는 기한의 이익을 상실하는 것으로 하며, 각 당사자는 이를 상계한 후 서면으로 상계사실을 통지하기로 한다.<br>③ 각 당사자는 제 11 조 ③항의 손해가 발생한 경우, 해당 손해배상채권과 채무를 대등액에서 상계할 수 있다.</div>

  <div class="style-subtitle">▪제 13 조 (권리의 양도)</div>
  <div class="style-body">① "${data.supplierName || '□□□'}"(을)는 (주) 교보문고의 서면에 의한 사전 승인 없이 본 계약상의 권리, 의무 등을 제 3 자에게 양도 또는 이전할 수 없다.<br>② "${data.supplierName || '□□□'}"(을)는 (주) 교보문고의 서면에 의한 사전 승인 없이 (주) 교보문고에 대한 채권을 제 3 자에게 양도하거나 담보로 제공할 수 없다. 단, 상품판매대금 채권 등 금전채권의 경우에는 (주) 교보문고에 대한 사전 통지 후 제 3 자에게 양도 또는 담보제공할 수 있다.</div>

  <div class="style-subtitle">▪제 14 조 (계약 해지)</div>
  <div class="style-body">① (주) 교보문고와 "${data.supplierName || '□□□'}"은 다음 각 호의 어느 하나에 해당하는 사유가 발생할 경우 이 계약을 해지할 수 있다.<br>&nbsp;&nbsp;가. (주) 교보문고 또는 "${data.supplierName || '□□□'}"이 발행한 어음/수표가 지급거절되거나, 회생, 파산 절차의 신청이 있거나, 채권자의 신청에 의해 동 절차가 개시된 경우<br>&nbsp;&nbsp;나. (주) 교보문고 또는 "${data.supplierName || '□□□'}"의 주요재산에 대하여 강제집행 등이 실행되어 더 이상의 이 계약 이행이 곤란한 경우<br>&nbsp;&nbsp;다. 이 계약에 명시된 브랜드나 거래품목의 생산이 중단 또는 종료되어 (주) 교보문고가 계약해지를 요청한 경우<br>&nbsp;&nbsp;라. "${data.supplierName || '□□□'}"이 납품한 상품이 관계법령에 저촉되거나, 라이선스 계약이 종료되어 해당 상품의 납품 또는 판매가 불가능한 경우<br>② (주) 교보문고 또는 "${data.supplierName || '□□□'}"이 이 계약의 중요한 사항을 위반한 경우 14 일 이상의 기간을 정하여 상대방에게 서면 또는 이메일로 시정을 요구하고, 이 기간 내에 사유가 시정되지 아니한 경우 해지할 수 있다.<br>③ 제 1 항 및 제 2 항에 해당되지 않는 부득이한 사유로 어느 일방이 이 계약을 해지하려는 경우에는 해지 3 개월 전까지 상대방에게 그 사유를 서면으로 통지하여야 해지할 수 있다.<br>④ 이 조에 의하여 계약이 해지된 경우, 계약해지에 관하여 책임 있는 당사자는 상대방에 대하여 계약해지로 인한 손해를 배상하여야 한다.</div>

  <div class="style-subtitle">▪제 15 조 (계약 유효기간 및 갱신)</div>
  <div class="style-body">① 본 계약의 유효기간은 ${data.tradeStartDate || '2026/01/29'} 부터 ${data.tradeEndDate || '2026/04/29'} 까지 ${data.tradePeriod || '1 년간'}으로 한다.<br>② 본 계약기간 만료일로부터 1 개월전까지 당사자 어느 일방으로부터 서면으로 별도의 의사표시가 없는 경우에는 본 계약은 동일한 조건으로 자동 연장하는 것으로 본다.</div>

  <div class="style-subtitle">▪제 16 조 (윤리경영을 위한 협약)</div>
  <div class="style-body">(주) 교보문고 또는 "${data.supplierName || '□□□'}"(각 피고용인 포함)은 상거래 시에 다음 사항을 준수하여야 한다.<br>① (주) 교보문고의 경우<br>&nbsp;&nbsp;가. 금품이나 선물(물품), 향응, 편의 또는 접대를 받는 등 부당한 이익을 취하거나 부도덕한 행위를 하지 않는다.<br>&nbsp;&nbsp;나. 매장의 상품이나 샘플 등을 부당하게 요구하지 아니한다.<br>&nbsp;&nbsp;다. 투명하고 공정한 거래를 통하여 상호 신뢰와 협력 관계를 유지하고, 우월적 지위를 이용하여 부당한 요구나 비윤리적 행위를 하지 않는다.<br>② "${data.supplierName || '□□□'}"의 경우<br>&nbsp;&nbsp;가. 금품이나 선물(물품), 향응, 편의를 제공하거나 또는 접대를 하지 않는다.<br>&nbsp;&nbsp;나. 위생, 안전, 품질, 고객서비스 관리 부실에 대해서 상응한 책임을 진다.<br>&nbsp;&nbsp;다. 금전 및 물품거래, 근무기강 및 업무자세와 관련하여 기업기본윤리를 성실히 지켜야 한다.<br>③ 상호 신뢰 및 위반 시 조치<br>&nbsp;&nbsp;가. (주)교보문고와 "${data.supplierName || '□□□'}"(을)는 본 협약 내용에 대하여 상호 신뢰 하에 피고용인들을 상대로 수시로 점검 교육한다. 본 협약을 위반하는 피고용인 등에 대해서는 적절한 조치의 기준을 마련하고, 이에 따라 징계 조치하도록 한다.<br>&nbsp;&nbsp;나. 계약당사자 일방이 본 조를 위반한 경우, 상대방 당사자는 위반 내용에 대하여 1 차 서면 경고를, 2 차 위반시에는 거래중단 조치를 취할 수 있다.</div>

  <div class="style-subtitle">▪제 17 조 (변경 · 수정 및 해석)</div>
  <div class="style-body">① 본 계약서의 내용은 양당사자의 서면합의로만 변경 · 수정될 수 있으며, 그 변경 · 수정은 양당사자가 기명·날인(서명)함과 동시에 그 효력이 발생한다.<br>② 본 계약에 명시하지 않은 사항이나 조문해석에 이견이 있을 시는 상호협의하여, 합의가 되지 아니한 경우 관련법규 및 상관례에 따른다.</div>

  <div class="style-subtitle">▪제 18 조 (분쟁의 해결)</div>
  <div class="style-body">① 본 계약으로 발생하는 (주)교보문고와 "${data.supplierName || '□□□'}" 간 소송의 관할법원은 거래가 이루어지는 당해 (주) 교보문고의 사업장 소재지의 관할 법원으로 한다.<br>② 거래가 이루어지는 사업장이 다수인 경우 거래규모가 가장 큰 (주) 교보문고의 사업장 소재지 관할 법원을 원칙으로 하되, 합의하여 결정할 수 있다.</div>

  <div class="style-subtitle">▪제 19 조 (계약의 효력)</div>
  <div class="style-body">본 계약서의 체결과 동시에 기존에 (주)교보문고와 "${data.supplierName || '□□□'}" 사이에 체결한 거래약정서는 효력을 상실하며, 본 계약서와 관련하여 (주)교보문고와 "${data.supplierName || '□□□'}"(이)가 체결한 별도 합의서, 부속합의서 등을 포함하는 것으로 한다. 단, 상호간에 불일치가 있는 경우에는 최근에 유효하게 체결된 문서가 우선한다.</div>

  <br>
  <div class="style-bodycenter" style="margin-top: 20px; margin-bottom: 20px;">본 계약을 증명하기 위하여 (주) 교보문고, "${data.supplierName || '□□□'}" 쌍방은 상기 계약조항을 확인하고 기명 · 날인(서명)하여 각각 1 통식 보관한다.</div>

  <div class="style-attachment" style="page-break-before: always;">▪별첨 1. 취급브랜드 협의서</div>
  <div class="style-body">(주)교보문고와 "${data.supplierName || '□□□'}"(을)는 본 계약서 제 1 조 ②항에 따라 거래품목과 취급브랜드에 대해 다음과 같이 합의한다.</div>

  <div class="style-body">1. 거래품목 및 취급브랜드</div>
  <table class="contract-table editable-table" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th contenteditable="true" style="border: 1px solid #000; padding: 8px; width: 15%;">구분</th>
        <th contenteditable="true" style="border: 1px solid #000; padding: 8px; width: 35%;">거래품목</th>
        <th contenteditable="true" style="border: 1px solid #000; padding: 8px; width: 35%;">취급브랜드</th>
        <th contenteditable="true" style="border: 1px solid #000; padding: 8px; width: 15%;">수수료</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.category || 'ㅁㅁㅁ'}</td>
        <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.items || 'ㅁㅁㅁ'}</td>
        <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.brand || 'ㅁㅁㅁ'}</td>
        <td contenteditable="true" style="border: 1px solid #000; padding: 8px;">${data.commission || 'ㅁㅁㅁ'}%</td>
      </tr>
    </tbody>
  </table>
  <div class="style-subtitle">* 단, 상품별 수수료가 상이 할 경우 평균 수수료를 표기하며, 상품별 수수료는 거래명세서를 따른다.</div>

  <div class="style-body">2. "${data.supplierName || '□□□'}"(을)는 제 1 항의 거래품목 및 취급브랜드에 대한 원활한 상품 공급을 위해 노력하여야 하며, 거래품목 및 취급브랜드의 공급이 중단될 경우 서면으로 통보하고 "취급브랜드 합의서"를 갱신하여야 한다.</div>

  <div class="style-attachment" style="margin-top: 40px; page-break-before: auto !important;">▪별첨 2. 반품약정서</div>
  <div class="style-body">
    (주)교보문고와 "${data.supplierName || '□□□'}" 간의 거래에 관하여 다음과 같은 조건으로 반품을 약정한다.<br>
    다양한 상품 진열 및 판매 촉진을 위해, 일부 지정된 상품을 대하여 "${data.supplierName || '□□□'}" (을)는 (주) 교보문고에게 반품을 요청할 수 있다. 이때, "${data.supplierName || '□□□'}"은 반품요청서 등 별도 양식에 따라 당해 상품이 지정된 상품이며 상품의 교체가 자신에게 이익이 된다는 객관적 자료를 제출하여야 한다.<br>
    신규상품 교체, 시장테스트 상품의 반품 등 거래관계에서 합리적이고 인정되는 기간 내 반품은 요청할 수 있다. 이때, "${data.supplierName || '□□□'}"은 반품요청서 등 별도 양식에 따라 당해 상품의 교체가 이루어지거나 시장테스트 상품이며 반품이 자신에게 이익이 된다는 객관적 자료를 제출하여야 한다.<br>
    상호 합의에 따라 특정기간이나 시즌에만 판매가 진행되는 각종 상품이 출품되었을 시에는 (주) 교보문고는 "${data.supplierName || '□□□'}"(을)에게 당해 특정기간 또는 시즌이 종료된 때로부터 30 일 이내에 당해 상품 매입액의 __% 이내에서 상호 협의 후에 반품을 요청할 수 있다.
  </div>

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