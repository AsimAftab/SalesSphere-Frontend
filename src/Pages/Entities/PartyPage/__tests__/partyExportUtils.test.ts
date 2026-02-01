import { describe, it, expect } from "vitest";

// Test the data transformation logic used in party excel export

interface MockParty {
  id: string;
  companyName?: string;
  partyName?: string;
  ownerName: string;
  partyType?: string;
  email?: string;
  phone?: string;
  panVat?: string;
  panVatNumber?: string;
  dateCreated?: string;
  createdAt?: string;
  address?: string;
  description?: string;
  image?: string;
  contact?: { phone?: string; email?: string };
  location?: { address?: string };
}

function transformPartyRow(party: MockParty, index: number) {
  const rawPhone = party.phone || party.contact?.phone;
  const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, "")) : null;
  const panVatValue = party.panVat || party.panVatNumber;
  const panVatString = panVatValue ? String(panVatValue) : "N/A";

  return {
    s_no: index + 1,
    companyName: party.companyName || party.partyName || "",
    ownerName: party.ownerName,
    partyType: party.partyType || "Not Specified",
    email: party.email || party.contact?.email || "N/A",
    phone: phoneAsNumber || "N/A",
    panVat: panVatString,
    address: party.address || party.location?.address || "",
    description: party.description || "N/A",
    image: party.image ? "has_image" : "No Image",
  };
}

function filterByIds(allData: MockParty[], filteredIds: Set<string>): MockParty[] {
  return allData.filter((p) => filteredIds.has(p.id));
}

describe("Party export – row transformation", () => {
  it("uses companyName as primary name", () => {
    const row = transformPartyRow({ id: "1", companyName: "Acme", ownerName: "John" }, 0);
    expect(row.companyName).toBe("Acme");
  });

  it("falls back to partyName", () => {
    const row = transformPartyRow({ id: "1", partyName: "Beta", ownerName: "John" }, 0);
    expect(row.companyName).toBe("Beta");
  });

  it("converts phone string to number", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J", phone: "123-456-7890" }, 0);
    expect(row.phone).toBe(1234567890);
  });

  it("uses contact.phone as fallback", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J", contact: { phone: "9876543210" } }, 0);
    expect(row.phone).toBe(9876543210);
  });

  it("defaults phone to N/A when missing", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J" }, 0);
    expect(row.phone).toBe("N/A");
  });

  it("uses panVatNumber as fallback", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J", panVatNumber: "PAN123" }, 0);
    expect(row.panVat).toBe("PAN123");
  });

  it("defaults partyType to 'Not Specified'", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J" }, 0);
    expect(row.partyType).toBe("Not Specified");
  });

  it("uses location.address as fallback", () => {
    const row = transformPartyRow({ id: "1", ownerName: "J", location: { address: "123 St" } }, 0);
    expect(row.address).toBe("123 St");
  });

  it("s_no is 1-indexed", () => {
    expect(transformPartyRow({ id: "1", ownerName: "J" }, 0).s_no).toBe(1);
    expect(transformPartyRow({ id: "1", ownerName: "J" }, 4).s_no).toBe(5);
  });
});

describe("Party export – ID filtering", () => {
  const allData: MockParty[] = [
    { id: "1", ownerName: "A" },
    { id: "2", ownerName: "B" },
    { id: "3", ownerName: "C" },
  ];

  it("filters to matching IDs", () => {
    expect(filterByIds(allData, new Set(["1", "3"]))).toHaveLength(2);
  });

  it("returns empty for no matches", () => {
    expect(filterByIds(allData, new Set(["99"]))).toHaveLength(0);
  });
});
