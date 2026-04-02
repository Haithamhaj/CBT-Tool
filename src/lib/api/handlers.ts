import {
  practiceSetupRequestSchema,
  progressRetrievalRequestSchema,
  reviewRetrievalRequestSchema,
  sessionStartRequestSchema,
  stepSubmissionRequestSchema
} from "../../contracts";
import { ZodError } from "zod";
import type { Repository } from "../db/repository";
import { InMemoryRepository } from "../db/in-memory-repository";
import { PracticeService } from "../services/practice-service";
import { ProgressService } from "../services/progress-service";
import { ReviewService } from "../services/review-service";

export type ApiResponse<T> = {
  status: number;
  body: T | { error: string };
};

export function buildHandlers(repo: Repository = new InMemoryRepository()) {
  const practiceService = new PracticeService(repo);
  const reviewService = new ReviewService(repo);
  const progressService = new ProgressService(repo);

  return {
    async practiceSetup(payload: unknown): Promise<ApiResponse<Awaited<ReturnType<PracticeService["setupPractice"]>>>> {
      try {
        const request = practiceSetupRequestSchema.parse(payload);
        return { status: 200, body: await practiceService.setupPractice(request) };
      } catch (error) {
        return { status: 400, body: { error: error instanceof Error ? error.message : "Unknown error" } };
      }
    },

    async sessionStart(payload: unknown): Promise<ApiResponse<Awaited<ReturnType<PracticeService["startSession"]>>>> {
      try {
        const request = sessionStartRequestSchema.parse(payload);
        return { status: 200, body: await practiceService.startSession(request) };
      } catch (error) {
        return { status: 400, body: { error: error instanceof Error ? error.message : "Unknown error" } };
      }
    },

    async stepSubmit(payload: unknown): Promise<ApiResponse<Awaited<ReturnType<PracticeService["submitStep"]>>>> {
      try {
        const request = stepSubmissionRequestSchema.parse(payload);
        return { status: 200, body: await practiceService.submitStep(request) };
      } catch (error) {
        if (error instanceof ZodError) {
          return { status: 400, body: { error: "Unable to submit step." } };
        }
        return { status: 400, body: { error: error instanceof Error ? error.message : "Unknown error" } };
      }
    },

    async reviewGet(payload: unknown): Promise<ApiResponse<Awaited<ReturnType<ReviewService["getReview"]>>>> {
      try {
        const request = reviewRetrievalRequestSchema.parse(payload);
        return { status: 200, body: await reviewService.getReview(request) };
      } catch (error) {
        return { status: 400, body: { error: error instanceof Error ? error.message : "Unknown error" } };
      }
    },

    async progressGet(payload: unknown): Promise<ApiResponse<Awaited<ReturnType<ProgressService["getProgress"]>>>> {
      try {
        const request = progressRetrievalRequestSchema.parse(payload);
        return { status: 200, body: await progressService.getProgress(request) };
      } catch (error) {
        return { status: 400, body: { error: error instanceof Error ? error.message : "Unknown error" } };
      }
    }
  };
}
