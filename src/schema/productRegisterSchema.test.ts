import {
    DETAIL_PHOTO_MAX,
    IMAGE_FILE_SIZE_MAX,
    productRegisterSchema,
    WEAR_PHOTO_MAX,
} from "@/schema/productRegisterSchema";
import { describe, expect, it } from "vitest";

const image = (name: string, size = 1) => {
    const file = new File([], name, { type: "image/png" });
    Object.defineProperty(file, "size", { value: size });
    return file;
};

const validInput = () => ({
    productType: "tote" as const,
    frontPhoto: image("front.png"),
    detailPhotos: [],
    wearPhotos: [],
});

describe("productRegisterSchema", () => {
    it("장당 정확히 20MB인 이미지는 허용한다", () => {
        expect(
            productRegisterSchema.safeParse({
                ...validInput(),
                frontPhoto: image("front.png", IMAGE_FILE_SIZE_MAX),
            }).success
        ).toBe(true);
    });

    it("장당 20MB를 1바이트라도 넘으면 거부한다", () => {
        const result = productRegisterSchema.safeParse({
            ...validInput(),
            frontPhoto: image("front.png", IMAGE_FILE_SIZE_MAX + 1),
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.message).toBe(
            "사진은 장당 20MB 이하로 업로드해주세요"
        );
    });

    it("디테일 사진은 최대 4장까지만 허용한다", () => {
        const result = productRegisterSchema.safeParse({
            ...validInput(),
            detailPhotos: Array.from(
                { length: DETAIL_PHOTO_MAX + 1 },
                (_, index) => image(`detail-${index}.png`)
            ),
        });

        expect(result.success).toBe(false);
    });

    it("마모 사진은 최대 5장까지만 허용한다", () => {
        const result = productRegisterSchema.safeParse({
            ...validInput(),
            wearPhotos: Array.from({ length: WEAR_PHOTO_MAX + 1 }, (_, index) =>
                image(`wear-${index}.png`)
            ),
        });

        expect(result.success).toBe(false);
    });
});
