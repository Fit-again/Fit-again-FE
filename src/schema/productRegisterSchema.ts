/**
 * 제품 등록 폼 검증 스키마입니다.
 * 제품 유형과 정면 사진은 필수이며, 추가 사진은 디자인에서 정한 최대 개수를
 * 넘지 않도록 프론트에서 먼저 검증합니다.
 */

import { PRODUCT_TYPES } from "@/constants/productTypes";
import type { ProductType } from "@/types/reformFlow";
import z from "zod";

export const DETAIL_PHOTO_MAX = 4;
export const WEAR_PHOTO_MAX = 5;
export const IMAGE_FILE_SIZE_MAX = 20 * 1024 * 1024;

const imageFileSchema = z
    .custom<File>((value) => value instanceof File, {
        error: "정면 사진을 업로드해주세요",
    })
    .refine((file) => file instanceof File && file.type.startsWith("image/"), {
        message: "올바른 제품이 아닙니다",
    })
    .refine(
        (file) => file instanceof File && file.size <= IMAGE_FILE_SIZE_MAX,
        {
            message: "사진은 장당 20MB 이하로 업로드해주세요",
        }
    );

const optionalImageFilesSchema = z.array(
    z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"))
        .refine((file) => file.size <= IMAGE_FILE_SIZE_MAX, {
            message: "사진은 장당 20MB 이하로 업로드해주세요",
        })
);

export const productRegisterSchema = z.object({
    productType: z.custom<ProductType>(
        (value) => PRODUCT_TYPES.some(({ id }) => id === value),
        { error: "제품 유형을 선택해주세요" }
    ),
    frontPhoto: imageFileSchema,
    detailPhotos: optionalImageFilesSchema.max(DETAIL_PHOTO_MAX),
    wearPhotos: optionalImageFilesSchema.max(WEAR_PHOTO_MAX),
});

export type ProductRegisterFormType = z.infer<typeof productRegisterSchema>;
