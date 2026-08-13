export const ANALYSIS_STEPS = [
    { id: "product", label: "제품 정보 확인 중" },
    { id: "pain-point", label: "불편 사항 분석 중" },
    { id: "solution", label: "리폼 방향 도출 중" },
] as const;

/* 실제 AI 이미지 분석 API 연동 전까지 사용하는 목업 결과입니다. */
export const MOCK_ANALYSIS = {
    externalStructure: ["더블 핸들", "탈부착 스트랩", "사이드 포켓"],
    damageStatus: ["모서리 마모", "스트랩 사용감"],
    usagePurpose: "출퇴근용",
    improvementSuggestions: [
        "경량 스트랩 교체",
        "어깨 패드 추가",
        "모서리 보강",
    ],
} as const;
