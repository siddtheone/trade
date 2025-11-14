import { http, HttpResponse } from "msw";
import { getMockTrades } from "../mockTrades";

export const handlers = [
  http.get("/api/trades", () => {
    return HttpResponse.json(getMockTrades());
  }),
];
