/** 공식 상담 신청 폼 검증 스키마입니다. */

import { CONTACT_REGEX } from "@/constants/result";
import type { SolutionType, UpcycleProductType } from "@/types/recommendation";
import z from "zod";

export const UPCYCLE_IMPORTANT_PARTS = [
    "기존 디자인 보존",
    "가벼운 무게",
    "실용적인 수납",
    "브랜드 디테일 활용",
    "기타",
] as const;

const consultationBaseSchema = z.object({
    name: z.string().trim().min(1, "성명을 입력해주세요"),
    contact: z
        .string()
        .trim()
        .min(1, "연락처를 입력해주세요")
        .regex(CONTACT_REGEX, "올바른 연락처 형식이 아닙니다"),
    message: z.string(),
    upcycleProducts: z.array(z.enum(["mini-crossbag", "card-wallet", "pouch"])),
    importantParts: z.array(z.enum(UPCYCLE_IMPORTANT_PARTS)),
    agreed: z.boolean().refine((value) => value, {
        message: "개인정보 수집 및 이용에 동의해주세요",
    }),
});

export const createConsultationSchema = (solutionType: SolutionType) =>
    consultationBaseSchema.superRefine((values, context) => {
        if (solutionType === "upcycle" && values.upcycleProducts.length === 0) {
            context.addIssue({
                code: "custom",
                path: ["upcycleProducts"],
                message: "희망 업사이클링 제품을 선택해주세요",
            });
        }
    });

export const consultationSchema = createConsultationSchema("reform");

export type ConsultationFormType = z.infer<typeof consultationSchema>;
export type UpcycleConsultationProduct = UpcycleProductType;
