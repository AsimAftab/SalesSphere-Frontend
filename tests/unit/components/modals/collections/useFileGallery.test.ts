import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFileGallery } from "@/components/modals/Collections/hooks/useFileGallery";

// Mock URL.createObjectURL/revokeObjectURL for jsdom
globalThis.URL.createObjectURL = () => "blob:mock-url";
globalThis.URL.revokeObjectURL = () => { };

const makeFile = (name: string) => new File(["content"], name, { type: "image/png" });

describe("useFileGallery", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useFileGallery(5));
    expect(result.current.newFiles).toEqual([]);
    expect(result.current.existingImages).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.isFull).toBe(false);
  });

  it("adds files up to max limit", () => {
    const { result } = renderHook(() => useFileGallery(2));
    act(() => result.current.addFiles([makeFile("a.png"), makeFile("b.png"), makeFile("c.png")]));
    expect(result.current.newFiles).toHaveLength(2);
    expect(result.current.isFull).toBe(true);
  });

  it("accounts for existing images in slot calculation", () => {
    const { result } = renderHook(() => useFileGallery(3));
    act(() => result.current.setInitialImages([{ imageUrl: "http://x.com/1.png" }, { imageUrl: "http://x.com/2.png" }]));
    act(() => result.current.addFiles([makeFile("a.png"), makeFile("b.png")]));
    // 2 existing + 1 new (only 1 slot remaining)
    expect(result.current.newFiles).toHaveLength(1);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.isFull).toBe(true);
  });

  it("removes a new file by index", () => {
    const { result } = renderHook(() => useFileGallery(5));
    act(() => result.current.addFiles([makeFile("a.png"), makeFile("b.png")]));
    act(() => result.current.removeNewFile(0));
    expect(result.current.newFiles).toHaveLength(1);
    expect(result.current.newFiles[0].name).toBe("b.png");
  });

  it("removes an existing image by index", () => {
    const { result } = renderHook(() => useFileGallery(5));
    act(() => result.current.setInitialImages([{ imageUrl: "a" }, { imageUrl: "b" }]));
    act(() => result.current.removeExistingImage(0));
    expect(result.current.existingImages).toHaveLength(1);
  });

  it("clearAll resets everything", () => {
    const { result } = renderHook(() => useFileGallery(5));
    act(() => result.current.setInitialImages([{ imageUrl: "a" }]));
    act(() => result.current.addFiles([makeFile("b.png")]));
    act(() => result.current.clearAll());
    expect(result.current.totalCount).toBe(0);
  });

  it("does not add when already full", () => {
    const { result } = renderHook(() => useFileGallery(1));
    act(() => result.current.addFiles([makeFile("a.png")]));
    act(() => result.current.addFiles([makeFile("b.png")]));
    expect(result.current.newFiles).toHaveLength(1);
  });
});
