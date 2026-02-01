import { describe, it, expect } from "vitest";
import { transformToStatCards } from "../DashboardMapper";

function mockData(stats: Record<string, number>) {
  return { stats } as unknown as Parameters<typeof transformToStatCards>[0];
}

describe("DashboardMapper – transformToStatCards", () => {
  it("returns empty array for undefined data", () => {
    expect(transformToStatCards(undefined)).toEqual([]);
  });

  it("returns empty array when stats is missing", () => {
    expect(transformToStatCards({} as unknown as Parameters<typeof transformToStatCards>[0])).toEqual([]);
  });

  it("returns 5 stat cards for valid data", () => {
    const cards = transformToStatCards(mockData({
      totalParties: 100, totalPartiesToday: 5, totalOrdersToday: 10, pendingOrders: 3, totalSalesToday: 50000,
    }));
    expect(cards).toHaveLength(5);
  });

  it("maps values correctly", () => {
    const cards = transformToStatCards(mockData({
      totalParties: 42, totalPartiesToday: 7, totalOrdersToday: 15, pendingOrders: 4, totalSalesToday: 123456,
    }));
    expect(cards[0].value).toBe(42);
    expect(cards[0].title).toBe("Total No. of Parties");
    expect(cards[0].link).toBe("/parties");
  });

  it("formats total sales with Rs prefix", () => {
    const cards = transformToStatCards(mockData({
      totalParties: 0, totalPartiesToday: 0, totalOrdersToday: 0, pendingOrders: 0, totalSalesToday: 50000,
    }));
    const salesCard = cards[4];
    expect(salesCard.title).toContain("Order Value");
    expect(String(salesCard.value)).toContain("Rs");
  });

  it("last card has no link", () => {
    const cards = transformToStatCards(mockData({
      totalParties: 0, totalPartiesToday: 0, totalOrdersToday: 0, pendingOrders: 0, totalSalesToday: 0,
    }));
    expect(cards[4].link).toBeUndefined();
  });
});
