/// <reference types="cypress" />

describe("Trades E2E", () => {
  const mockTrades = [
    {
      tradeId: 1,
      version: 1,
      counterPartyId: "CP-1",
      bookId: "B1",
      maturityDate: "2030-01-01T00:00:00.000Z",
      createdDate: "2024-01-01T00:00:00.000Z",
    },
  ];

  it("displays trades from API (happy path)", () => {
    cy.intercept("GET", "/api/trades", {
      statusCode: 200,
      body: mockTrades,
    }).as("getTrades");

    cy.visit("/");
    cy.wait("@getTrades");

    cy.contains("T-1").should("be.visible");
    cy.contains("Active").should("be.visible");
  });

  it("shows validation error when creating trade with past maturity date", () => {
    cy.intercept("GET", "/api/trades", {
      statusCode: 200,
      body: [],
    }).as("getTrades");

    cy.visit("/");
    cy.wait("@getTrades");

    cy.contains("Create Trade").click();
    cy.get('input[name="tradeId"]').clear().type("101");
    cy.get('input[name="version"]').clear().type("1");
    cy.get('input[name="maturityDate"]').clear().type("2000-01-01");
    cy.contains("button", /^Create$/i).click();

    cy.contains("Maturity Date cannot be earlier than today").should(
      "be.visible"
    );
  });
});
