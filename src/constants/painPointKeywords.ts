export type PainPointKeyword = {
    id: string;
    label: string;
};

export const PAIN_POINT_KEYWORDS: PainPointKeyword[] = [
    { id: "heavy", label: "무거움" },
    { id: "strap-slip", label: "스트랩이 흘러내림" },
    { id: "shoulder-pain", label: "어깨가 아픔" },
    { id: "lack-storage", label: "수납 공간 부족" },
    { id: "wear", label: "마모가 신경 쓰임" },
    { id: "style-mismatch", label: "현재 스타일과 맞지 않음" },
    { id: "rarely-used", label: "특별한 날에만 사용함" },
    { id: "outdated-design", label: "디자인이 올드함" },
    { id: "lock-zipper", label: "잠금/지퍼 불편" },
];

/*
 * AI 분석 결과의 "주요 불편 원인" 문구는 선택된 불편 키워드를 기준으로 도출합니다.
 */
export const PAIN_POINT_CAUSE_TEXT: Record<string, string> = {
    heavy: "무게가 부담됨",
    "strap-slip": "스트랩이 자주 흘러내림",
    "shoulder-pain": "어깨에 부담이 감",
    "lack-storage": "수납 공간이 부족함",
    wear: "마모가 눈에 띔",
    "style-mismatch": "현재 스타일과 어울리지 않음",
    "rarely-used": "사용 빈도가 낮음",
    "outdated-design": "디자인이 올드하게 느껴짐",
    "lock-zipper": "잠금·지퍼 사용이 불편함",
};
