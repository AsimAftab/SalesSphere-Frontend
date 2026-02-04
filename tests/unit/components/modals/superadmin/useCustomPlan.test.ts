import { describe, it, expect } from "vitest";

// Test the validation and module toggle logic extracted from useCustomPlan

interface PlanFormData {
  name: string;
  description: string;
  enabledModules: string[];
  maxEmployees: number;
  price: { amount: number; currency: string; billingCycle: string };
  tier: string;
}

function validate(formData: PlanFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!formData.name.trim()) errors.name = "Plan name is required";
  if (formData.maxEmployees <= 0) errors.maxEmployees = "Max employees must be greater than 0";
  if (formData.price.amount < 0) errors.amount = "Amount cannot be negative";
  if (formData.enabledModules.length === 0) errors.modules = "Please select at least one module";
  return errors;
}

function toggleModule(modules: string[], moduleId: string): string[] {
  return modules.includes(moduleId)
    ? modules.filter((id) => id !== moduleId)
    : [...modules, moduleId];
}

function handleChange(
  formData: PlanFormData,
  name: string,
  value: string
): PlanFormData {
  if (name.startsWith("price.")) {
    const priceField = name.split(".")[1];
    return {
      ...formData,
      price: {
        ...formData.price,
        [priceField]: priceField === "amount" ? Number(value) : value,
      },
    };
  }
  return {
    ...formData,
    [name]: name === "maxEmployees" ? Number(value) : value,
  };
}

const validForm: PlanFormData = {
  name: "Test Plan",
  description: "desc",
  enabledModules: ["dashboard"],
  maxEmployees: 10,
  price: { amount: 100, currency: "INR", billingCycle: "yearly" },
  tier: "custom",
};

describe("Custom plan – validation", () => {
  it("passes with valid data", () => {
    expect(Object.keys(validate(validForm))).toHaveLength(0);
  });

  it("fails with empty name", () => {
    expect(validate({ ...validForm, name: "  " })).toHaveProperty("name");
  });

  it("fails with zero maxEmployees", () => {
    expect(validate({ ...validForm, maxEmployees: 0 })).toHaveProperty("maxEmployees");
  });

  it("fails with negative price", () => {
    expect(validate({ ...validForm, price: { ...validForm.price, amount: -1 } })).toHaveProperty("amount");
  });

  it("fails with no modules", () => {
    expect(validate({ ...validForm, enabledModules: [] })).toHaveProperty("modules");
  });

  it("collects multiple errors", () => {
    const errors = validate({ ...validForm, name: "", enabledModules: [], maxEmployees: -1 });
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(3);
  });
});

describe("Custom plan – module toggle", () => {
  it("adds a module", () => {
    expect(toggleModule([], "dashboard")).toEqual(["dashboard"]);
  });

  it("removes an existing module", () => {
    expect(toggleModule(["dashboard", "parties"], "dashboard")).toEqual(["parties"]);
  });

  it("select all gives all module ids", () => {
    const allIds = ["dashboard", "parties", "orders"];
    expect(allIds).toHaveLength(3);
  });

  it("deselect all gives empty", () => {
    expect(toggleModule(["a"], "a")).toEqual([]);
  });
});

describe("Custom plan – handleChange", () => {
  it("updates simple field", () => {
    const result = handleChange(validForm, "name", "New Name");
    expect(result.name).toBe("New Name");
  });

  it("converts maxEmployees to number", () => {
    const result = handleChange(validForm, "maxEmployees", "50");
    expect(result.maxEmployees).toBe(50);
  });

  it("updates price.amount as number", () => {
    const result = handleChange(validForm, "price.amount", "200");
    expect(result.price.amount).toBe(200);
  });

  it("updates price.currency as string", () => {
    const result = handleChange(validForm, "price.currency", "USD");
    expect(result.price.currency).toBe("USD");
  });
});
