import { describe, it, expect } from "vitest";
import {
  toRadians,
  calculateHaversineDistance,
  formatVisit,
  colorConfig,
} from "../sessionUtils";

describe("toRadians", () => {
  it("converts 0 degrees to 0 radians", () => {
    expect(toRadians(0)).toBe(0);
  });

  it("converts 180 degrees to PI", () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });

  it("converts 90 degrees to PI/2", () => {
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
  });

  it("converts 360 degrees to 2*PI", () => {
    expect(toRadians(360)).toBeCloseTo(2 * Math.PI);
  });

  it("handles negative degrees", () => {
    expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2);
  });
});

describe("calculateHaversineDistance", () => {
  it("returns 0 for same coordinates", () => {
    expect(calculateHaversineDistance(27.7, 85.3, 27.7, 85.3)).toBeCloseTo(0);
  });

  it("calculates distance between Kathmandu and Pokhara (~200 km)", () => {
    // Kathmandu: 27.7172, 85.3240
    // Pokhara: 28.2096, 83.9856
    const distance = calculateHaversineDistance(27.7172, 85.324, 28.2096, 83.9856);
    expect(distance).toBeGreaterThan(140);
    expect(distance).toBeLessThan(160);
  });

  it("calculates distance between London and Paris (~340 km)", () => {
    const distance = calculateHaversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    expect(distance).toBeGreaterThan(330);
    expect(distance).toBeLessThan(350);
  });

  it("handles antipodal points (max ~20000 km)", () => {
    const distance = calculateHaversineDistance(0, 0, 0, 180);
    expect(distance).toBeGreaterThan(20000);
  });
});

describe("formatVisit", () => {
  const nameMap = new Map([["d1", "Acme Corp"]]);
  const addressMap = new Map([["d1", "123 Main St"]]);

  it("formats a visit with known directory", () => {
    const visit = {
      directoryId: "d1",
      directoryType: "party",
      visitedAt: "2026-01-15T10:30:00Z",
      status: "completed",
    };

    const result = formatVisit(visit, nameMap, addressMap);
    expect(result.title).toBe("Acme Corp");
    expect(result.subtitle).toBe("123 Main St");
    expect(result.type).toBe("visit");
    expect(result.directoryType).toBe("Party"); // capitalized
    expect(result.color).toBe("text-green-600");
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it("falls back to 'Unknown Location' for unknown directoryId", () => {
    const visit = {
      directoryId: "unknown",
      status: "pending",
    };
    const result = formatVisit(visit, nameMap, addressMap);
    expect(result.title).toBe("Unknown Location");
    expect(result.subtitle).toBe("Address not available");
  });

  it("handles missing visitedAt", () => {
    const visit = {
      directoryId: "d1",
      status: "pending",
    };
    const result = formatVisit(visit, nameMap, addressMap);
    expect(result.time).toBe("Unknown Time");
    expect(result.timestamp).toBe(0);
  });

  it("defaults directoryType label to 'Stop'", () => {
    const visit = {
      directoryId: "d1",
      status: "pending",
    };
    const result = formatVisit(visit, nameMap, addressMap);
    expect(result.directoryType).toBe("Stop");
  });
});

describe("colorConfig", () => {
  it("has Party, Prospect, Site, and default entries", () => {
    expect(colorConfig.Party).toBeDefined();
    expect(colorConfig.Prospect).toBeDefined();
    expect(colorConfig.Site).toBeDefined();
    expect(colorConfig.default).toBeDefined();
  });

  it("each entry has background, glyphColor, borderColor", () => {
    for (const key of Object.keys(colorConfig)) {
      expect(colorConfig[key]).toHaveProperty("background");
      expect(colorConfig[key]).toHaveProperty("glyphColor");
      expect(colorConfig[key]).toHaveProperty("borderColor");
    }
  });
});
