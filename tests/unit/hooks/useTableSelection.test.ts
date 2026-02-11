import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableSelection } from "@/hooks/useTableSelection";

const mockData = [
  { _id: "a1", name: "Item 1" },
  { _id: "a2", name: "Item 2" },
  { _id: "a3", name: "Item 3" },
];

const mockDataWithId = [
  { id: "b1", name: "Item 1" },
  { id: "b2", name: "Item 2" },
];

describe("useTableSelection", () => {
  it("starts with no selection", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    expect(result.current.selectedIds).toEqual([]);
  });

  it("toggleRow adds an id", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.toggleRow("a1"));
    expect(result.current.selectedIds).toEqual(["a1"]);
  });

  it("toggleRow removes an already-selected id", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.toggleRow("a1"));
    act(() => result.current.toggleRow("a1"));
    expect(result.current.selectedIds).toEqual([]);
  });

  it("selectAll(true) selects all _id values", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.selectAll(true));
    expect(result.current.selectedIds).toEqual(["a1", "a2", "a3"]);
  });

  it("selectAll(true) works with id field", () => {
    const { result } = renderHook(() => useTableSelection(mockDataWithId));
    act(() => result.current.selectAll(true));
    expect(result.current.selectedIds).toEqual(["b1", "b2"]);
  });

  it("selectAll(false) clears selection", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.selectAll(true));
    act(() => result.current.selectAll(false));
    expect(result.current.selectedIds).toEqual([]);
  });

  it("clearSelection empties the array", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.toggleRow("a1"));
    act(() => result.current.toggleRow("a2"));
    act(() => result.current.clearSelection());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("selectMultiple sets exact ids", () => {
    const { result } = renderHook(() => useTableSelection(mockData));
    act(() => result.current.selectMultiple(["a2", "a3"]));
    expect(result.current.selectedIds).toEqual(["a2", "a3"]);
  });
});
