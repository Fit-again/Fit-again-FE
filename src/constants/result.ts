export const RESULT_STEPS = [
    { id: "compile", label: "리폼 결과 데이터 정리 중" },
    { id: "difficulty", label: "예상 난이도 산정 중" },
    { id: "report", label: "AI 리폼 리포트 생성 중" },
] as const;

export const DIFFICULTY_LEVELS = [
    "매우 쉬움",
    "쉬움",
    "보통",
    "어려움",
    "매우 어려움",
] as const;

export const DEFAULT_RESOLVED_ISSUES = [
    "장시간 착용 시 어깨 부담",
    "스트랩 사용감",
    "모서리 마모",
];

/* 실제 AI 리폼 리포트 API 연동 전까지 사용하는 목업 결과입니다. */
export const MOCK_REPORT = {
    recommendation:
        "출퇴근용으로 사용하면서 발생한 어깨 부담과 외관 마모를 개선하기 위해 기능 개선 중심의 리폼을 추천합니다.",
    tasks: ["경량 스트랩", "어깨 패드 추가", "모서리 보강"],
    difficultyIndex: 2,
} as const;

export const CONTACT_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;
