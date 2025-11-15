import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import ComponentProvider from "../ComponentProvider";
import App from "../App";
import { server } from "../mocks/server";

const customRender = () =>
  render(
    <ComponentProvider>
      <App />
    </ComponentProvider>
  );

describe("App integration", () => {
  it("renders trades from the API response", async () => {
    const mockTrades = [
      {
        tradeId: 101,
        version: 1,
        counterPartyId: "CP-1",
        bookId: "B1",
        maturityDate: "2030-01-01T00:00:00.000Z",
        createdDate: "2024-01-01T00:00:00.000Z",
      },
    ];
    server.use(http.get("/api/trades", () => HttpResponse.json(mockTrades)));

    customRender();

    expect(await screen.findByText("T-101")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("shows validation error when maturity date is in the past", async () => {
    server.use(http.get("/api/trades", () => HttpResponse.json([])));
    customRender();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /create trade/i }));

    const tradeIdInput = await screen.findByLabelText("Trade Id");
    await user.clear(tradeIdInput);
    await user.type(tradeIdInput, "999");

    const versionInput = screen.getByLabelText("Version");
    await user.clear(versionInput);
    await user.type(versionInput, "1");

    const maturityInput = screen.getByLabelText("Maturity Date");
    await user.clear(maturityInput);
    await user.type(maturityInput, "2000-01-01");

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Maturity Date cannot be earlier than today")
      ).toBeInTheDocument()
    );
  });
});
