import { describe, it, expect } from "vitest";
import { getSafeImageUrl } from "@/utils/security";

describe("getSafeImageUrl", () => {
  it("returns null for null/undefined/empty", () => {
    expect(getSafeImageUrl(null)).toBeNull();
    expect(getSafeImageUrl(undefined)).toBeNull();
    expect(getSafeImageUrl("")).toBeNull();
  });

  // Safe URLs
  it("allows https URLs", () => {
    const url = "https://example.com/image.png";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  it("allows http URLs", () => {
    const url = "http://example.com/image.png";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  it("allows relative URLs", () => {
    const url = "/assets/icon.png";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  it("allows blob URLs", () => {
    const url = "blob:https://example.com/abc-123";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  it("allows valid data: image URLs (png)", () => {
    const url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  it("allows valid data: image URLs (jpeg)", () => {
    const url = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
    expect(getSafeImageUrl(url)).toBe(url);
  });

  // Dangerous URLs
  it("blocks javascript: protocol", () => {
    expect(getSafeImageUrl("javascript:alert(1)")).toBeNull();
  });

  it("blocks data: SVG (can contain scripts)", () => {
    expect(
      getSafeImageUrl("data:image/svg+xml;base64,PHN2ZyB4bWxucz0i")
    ).toBeNull();
  });

  it("blocks data: text/html", () => {
    expect(getSafeImageUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("blocks ftp: protocol", () => {
    expect(getSafeImageUrl("ftp://example.com/file.png")).toBeNull();
  });

  it("returns null for malformed URLs", () => {
    expect(getSafeImageUrl("javascript:void(0)")).toBeNull();
  });
});
