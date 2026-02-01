import { describe, it, expect } from "vitest";

// Test the carousel index cycling logic extracted from useFeatureNavigator

const TOTAL_FEATURES = 6; // FEATURES_DATA.length

function nextIndex(current: number, total: number): number {
  return (current + 1) % total;
}

function prevIndex(current: number, total: number): number {
  return (current - 1 + total) % total;
}

describe("Feature navigator – next index", () => {
  it("advances from 0 to 1", () => {
    expect(nextIndex(0, TOTAL_FEATURES)).toBe(1);
  });

  it("wraps from last to 0", () => {
    expect(nextIndex(TOTAL_FEATURES - 1, TOTAL_FEATURES)).toBe(0);
  });

  it("advances mid-range", () => {
    expect(nextIndex(3, TOTAL_FEATURES)).toBe(4);
  });
});

describe("Feature navigator – prev index", () => {
  it("goes from 1 to 0", () => {
    expect(prevIndex(1, TOTAL_FEATURES)).toBe(0);
  });

  it("wraps from 0 to last", () => {
    expect(prevIndex(0, TOTAL_FEATURES)).toBe(TOTAL_FEATURES - 1);
  });

  it("decrements mid-range", () => {
    expect(prevIndex(3, TOTAL_FEATURES)).toBe(2);
  });
});

describe("Feature navigator – full cycle", () => {
  it("cycles through all features and returns to start", () => {
    let idx = 0;
    for (let i = 0; i < TOTAL_FEATURES; i++) {
      idx = nextIndex(idx, TOTAL_FEATURES);
    }
    expect(idx).toBe(0);
  });

  it("reverse cycle returns to start", () => {
    let idx = 0;
    for (let i = 0; i < TOTAL_FEATURES; i++) {
      idx = prevIndex(idx, TOTAL_FEATURES);
    }
    expect(idx).toBe(0);
  });
});
