import { describe, it, expect } from "vitest";

// Extracted form state logic and constants from useContactForm

interface ContactFormState {
  fullName: string;
  email: string;
  department: string;
  requestType: string;
  message: string;
}

const INITIAL_STATE: ContactFormState = {
  fullName: "",
  email: "",
  department: "",
  requestType: "",
  message: "",
};

const REQUEST_TYPE_OPTIONS = [
  { value: "new-account", label: "Request for new account" },
  { value: "login-issue", label: "Forgot password / login issue" },
  { value: "update-details", label: "Update user details" },
  { value: "other", label: "Other" },
];

function updateField<K extends keyof ContactFormState>(
  form: ContactFormState,
  key: K,
  value: ContactFormState[K]
): ContactFormState {
  return { ...form, [key]: value };
}

describe("Contact form – initial state", () => {
  it("all fields start empty", () => {
    expect(Object.values(INITIAL_STATE).every((v) => v === "")).toBe(true);
  });

  it("has 5 fields", () => {
    expect(Object.keys(INITIAL_STATE)).toHaveLength(5);
  });
});

describe("Contact form – request type options", () => {
  it("has 4 options", () => {
    expect(REQUEST_TYPE_OPTIONS).toHaveLength(4);
  });

  it("each option has value and label", () => {
    REQUEST_TYPE_OPTIONS.forEach((opt) => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    });
  });

  it("includes 'other' option", () => {
    expect(REQUEST_TYPE_OPTIONS.some((o) => o.value === "other")).toBe(true);
  });
});

describe("Contact form – field updates", () => {
  it("updates fullName", () => {
    const result = updateField(INITIAL_STATE, "fullName", "John");
    expect(result.fullName).toBe("John");
    expect(result.email).toBe("");
  });

  it("updates email", () => {
    const result = updateField(INITIAL_STATE, "email", "a@b.com");
    expect(result.email).toBe("a@b.com");
  });

  it("preserves other fields", () => {
    const filled = { ...INITIAL_STATE, fullName: "John", email: "a@b.com" };
    const result = updateField(filled, "department", "Sales");
    expect(result.fullName).toBe("John");
    expect(result.email).toBe("a@b.com");
    expect(result.department).toBe("Sales");
  });
});
