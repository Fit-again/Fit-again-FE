import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import UpcyclePreviewPage from "@/pages/UpcyclePreview/UpcyclePreviewPage";
import { useReformFlowStore } from "@/stores/useReformFlowStore";
import { seedApiFlowStore } from "@/test/apiFixtures";
import type { RankedRecommendation } from "@/types/recommendation";

const renderPage = () =>
    render(
        <MemoryRouter>
            <UpcyclePreviewPage />
        </MemoryRouter>
    );

describe("UpcyclePreviewPage", () => {
    beforeEach(() => {
        useReformFlowStore.getState().resetFlow();
        useReformFlowStore.setState({
            ...seedApiFlowStore(),
            selectedSolution: "upcycle",
        });
    });

    afterEach(() => useReformFlowStore.getState().resetFlow());

    it("업사이클링 제품 선택지와 제안 이유를 보여준다", () => {
        renderPage();

        expect(
            screen.getByRole("heading", {
                name: "업사이클링 미리보기",
                level: 1,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /미니 크로스백/ })
        ).toHaveAttribute("aria-pressed", "true");
        expect(
            screen.getByRole("heading", {
                name: "왜 이 방향을 제안했을까요?",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", {
                name: "이렇게 달라질 수 있어요",
            })
        ).toBeInTheDocument();
    });

    it("제품을 선택하면 상세 예상 결과를 변경한다", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /카드지갑/ }));

        expect(
            screen.getByRole("button", { name: /카드지갑/ })
        ).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("카드지갑 예상 이미지")).toBeInTheDocument();
        expect(screen.getByText("무게가 부담스러워요")).toBeInTheDocument();
    });

    it("후보 카드에 서버가 생성한 이미지를 표시한다", () => {
        const seededStore = seedApiFlowStore();
        const recommendationRankings =
            seededStore.recommendationRankings.map<RankedRecommendation>(
                (recommendation) =>
                    recommendation.recommendationType === "UPCYCLING"
                        ? {
                              ...recommendation,
                              upcyclingCandidates:
                                  recommendation.upcyclingCandidates.map(
                                      (candidate) => ({
                                          ...candidate,
                                          imageUrl: `https://example.com/${candidate.itemName}.png`,
                                      })
                                  ),
                          }
                        : recommendation
            );
        useReformFlowStore.setState({ recommendationRankings });

        renderPage();

        expect(
            screen.getByRole("img", { name: "미니 크로스백 후보 이미지" })
        ).toHaveAttribute("src", "https://example.com/미니 크로스백.png");
        expect(
            screen.getByRole("img", { name: "카드지갑 후보 이미지" })
        ).toHaveAttribute("src", "https://example.com/카드지갑.png");
        expect(
            screen.getByRole("img", { name: "파우치 후보 이미지" })
        ).toHaveAttribute("src", "https://example.com/파우치.png");
    });
});
