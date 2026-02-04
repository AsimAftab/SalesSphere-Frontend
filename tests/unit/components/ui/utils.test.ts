import { describe, it, expect } from "vitest";
import { cn } from "@/components/ui/utils";

describe("cn – class name utility", () => {
  it("merges simple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const hidden = false as boolean;
    expect(cn("base", hidden && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("merges tailwind conflicting classes", () => {
    // twMerge should keep the last conflicting class
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });
});
