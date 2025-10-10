import { api } from "../api/api";
import type { SummaryRes } from "../models/Dashboard/dashBoardSummaryDto";
import type { PerfRes } from "../models/Dashboard/perfRes";

export async function getSummary() {
  const response = await api.get<SummaryRes>("/api/AI/summary");
  return response.data;
}

export async function getPerformance(from: string, to: string) {
  const response = await api.get<PerfRes>("/api/AI/performance", {
    params: {
      from: from,
      to: to,
    },
  });
  return response.data;
}

export async function getInsights(from: string, to: string) {
  const response = await api.get("/api/AI/insights", {
    params: {
      from: from,
      to: to,
    },
  });
  return response.data;
}

export async function getPredictRevenue(from: string, nextDays: string) {
  const response = await api.get("/api/AI/predict-revenue", {
    params: {
      from: from,
      nextDays: nextDays,
    },
  });
  return response.data;
}
