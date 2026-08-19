/*
 * 제품 유형별 SVG 아이콘을 공통 크기와 currentColor로 렌더링합니다.
 * SVG 원본은 프로젝트에 포함된 정적 에셋만 사용합니다.
 */

import backpackSvg from "@/assets/product-types/backpack.svg?raw";
import crossBagSvg from "@/assets/product-types/cross-bag.svg?raw";
import otherSvg from "@/assets/product-types/other.svg?raw";
import pouchSvg from "@/assets/product-types/pouch.svg?raw";
import shoulderBagSvg from "@/assets/product-types/shoulder-bag.svg?raw";
import toteBagSvg from "@/assets/product-types/tote-bag.svg?raw";
import type { ProductType } from "@/types/reformFlow";

const productTypeIcons: Record<ProductType, string> = {
    tote: toteBagSvg,
    shoulder: shoulderBagSvg,
    cross: crossBagSvg,
    backpack: backpackSvg,
    pouch: pouchSvg,
    other: otherSvg,
};

const normalizeIconColor = (svg: string) =>
    svg.replaceAll("#888888", "currentColor");

const ProductTypeIcon = ({
    type,
    className = "h-16 w-20",
}: {
    type: ProductType;
    className?: string;
}) => (
    <span
        className={`flex items-center justify-center [&_svg]:max-h-full [&_svg]:max-w-full ${className}`}
        dangerouslySetInnerHTML={{
            __html: normalizeIconColor(productTypeIcons[type]),
        }}
    />
);

export default ProductTypeIcon;
