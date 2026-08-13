import type { SimulationStep } from "@/types/simulation";

export const SIMULATION_STEPS: SimulationStep[] = [
    {
        id: "disassemble",
        stepNumber: 1,
        title: "해체",
        bullets: ["교체 대상 부위 확인", "기존 부품 분리 준비"],
    },
    {
        id: "replace",
        stepNumber: 2,
        title: "교체",
        bullets: ["경량 스트랩 교체", "어깨 패드 추가"],
    },
    {
        id: "reinforce",
        stepNumber: 3,
        title: "보강",
        bullets: ["모서리 보수", "가죽 마감 보강"],
    },
    {
        id: "complete",
        stepNumber: 4,
        title: "완성",
        bullets: ["최종 리폼 결과 확인", "개선된 사용 모습 미리보기"],
    },
];

export const DEFAULT_BEFORE_BULLETS = [
    "스트랩이 자주 흘러내림",
    "장시간 착용 시 어깨 부담",
    "모서리 마모로 외관이 손상됨",
];

export const DEFAULT_AFTER_BULLETS = [
    "경량 스트랩으로 착용감 개선",
    "어깨 패드 추가로 압력 분산",
    "모서리 보강으로 외관 복원",
    "기존 디자인을 유지하면서 사용성 향상",
];

/* 실제 AI 리폼 시뮬레이션 API 연동 전까지 사용하는 목업 문구입니다. */
export const AFTER_EFFECT_TEXT: Record<string, string> = {
    heavy: "경량 소재 적용으로 무게 부담 완화",
    "strap-slip": "경량 스트랩으로 착용감 개선",
    "shoulder-pain": "어깨 패드 추가로 압력 분산",
    "lack-storage": "수납 구조 보강으로 공간 확장",
    wear: "마모 부위 보강으로 외관 복원",
    "style-mismatch": "디자인 리터치로 스타일 개선",
    "rarely-used": "활용도를 높이는 리폼 적용",
    "outdated-design": "트렌드에 맞는 디자인으로 리프레시",
    "lock-zipper": "잠금·지퍼 부품 교체로 사용성 개선",
};
