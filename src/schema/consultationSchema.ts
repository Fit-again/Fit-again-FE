/** 공식 상담 신청 폼 검증 스키마입니다. */

import { CONTACT_REGEX } from "@/constants/result";
import z from "zod";

export const consultationSchema = z.object({
    name: z.string().trim().min(1, "성명을 입력해주세요"),
    contact: z
        .string()
        .trim()
        .min(1, "연락처를 입력해주세요")
        .regex(CONTACT_REGEX, "올바른 연락처 형식이 아닙니다"),
    message: z.string(),
    agreed: z.boolean().refine((value) => value, {
        message: "개인정보 수집 및 이용에 동의해주세요",
    }),
});

export type ConsultationFormType = z.infer<typeof consultationSchema>;
