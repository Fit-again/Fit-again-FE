import { useEffect, useRef } from "react";

/*
 * File/Blob 미리보기 URL의 생성과 해제를 한곳에서 관리합니다.
 * ref에 직접 URL을 연결해 StrictMode의 effect 재실행에서도
 * 해제된 URL이 React state에 남지 않도록 합니다.
 */
export const useObjectUrlImage = (source: Blob | null) => {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!source || !imageRef.current) return;

        const objectUrl = URL.createObjectURL(source);
        imageRef.current.src = objectUrl;

        return () => URL.revokeObjectURL(objectUrl);
    }, [source]);

    return imageRef;
};
