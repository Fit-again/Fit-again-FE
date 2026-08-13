/** 불편 입력 폼 검증 스키마입니다. */

import z from "zod";

export const DESCRIPTION_MAX = 1000;

export const painPointSchema = z.object({
    painPointKeywordIds: z
        .array(z.string())
        .min(1, "불편 키워드를 1개 이상 선택해주세요"),
    description: z.string().max(DESCRIPTION_MAX),
});

export type PainPointFormType = z.infer<typeof painPointSchema>;
