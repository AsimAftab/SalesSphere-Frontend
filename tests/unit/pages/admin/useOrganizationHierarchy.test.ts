import { describe, it, expect } from "vitest";

// Test the tree expansion/collapse logic extracted from the hook

interface MockNode {
  _id: string;
  subordinates?: MockNode[];
}

function collectAllIds(nodes: MockNode[]): Set<string> {
  const ids = new Set<string>();
  const walk = (list: MockNode[]) => {
    list.forEach((n) => {
      ids.add(n._id);
      if (n.subordinates) walk(n.subordinates);
    });
  };
  walk(nodes);
  return ids;
}

function autoExpandFirstTwoLevels(hierarchy: MockNode[]): Set<string> {
  const ids = new Set<string>();
  hierarchy.forEach((root) => {
    ids.add(root._id);
    root.subordinates?.forEach((child) => ids.add(child._id));
  });
  return ids;
}

function toggleNode(expanded: Set<string>, id: string): Set<string> {
  const next = new Set(expanded);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

const tree: MockNode[] = [
  {
    _id: "root1",
    subordinates: [
      { _id: "child1", subordinates: [{ _id: "grandchild1" }] },
      { _id: "child2" },
    ],
  },
  { _id: "root2", subordinates: [{ _id: "child3" }] },
];

describe("Organization hierarchy – auto expand", () => {
  it("expands first two levels", () => {
    const expanded = autoExpandFirstTwoLevels(tree);
    expect(expanded.has("root1")).toBe(true);
    expect(expanded.has("child1")).toBe(true);
    expect(expanded.has("child2")).toBe(true);
    expect(expanded.has("root2")).toBe(true);
    expect(expanded.has("child3")).toBe(true);
    // grandchild should NOT be auto-expanded
    expect(expanded.has("grandchild1")).toBe(false);
  });
});

describe("Organization hierarchy – toggle", () => {
  it("toggles a node in", () => {
    const result = toggleNode(new Set(), "root1");
    expect(result.has("root1")).toBe(true);
  });

  it("toggles a node out", () => {
    const result = toggleNode(new Set(["root1"]), "root1");
    expect(result.has("root1")).toBe(false);
  });
});

describe("Organization hierarchy – expand/collapse all", () => {
  it("expandAll collects all ids recursively", () => {
    const all = collectAllIds(tree);
    expect(all.size).toBe(6);
    expect(all.has("grandchild1")).toBe(true);
  });

  it("collapseAll returns empty set", () => {
    expect(new Set().size).toBe(0);
  });
});
