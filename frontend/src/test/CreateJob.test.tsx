import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { CreateJob } from "../pages/CreateJob";
import type { UseMutationResult } from "@tanstack/react-query";

const { mockCreateJob } = vi.hoisted(() => ({
  mockCreateJob: vi.fn(),
}));

vi.mock("../hooks/useCreateJob", () => ({
  useCreateJob: vi.fn().mockReturnValue({
    mutate: mockCreateJob,
    isPending: false,
    error: null,
  } as unknown as UseMutationResult<void, Error, string | number, unknown>),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe("CreateJob", () => {
  it("renders the form", () => {
    render(<CreateJob />, { wrapper });
    expect(screen.getByRole("button", { name: /create job/i })).toBeVisible();
  });

  it("submits the form with correct values", async () => {
    const user = userEvent.setup();
    render(<CreateJob />, { wrapper });

    await user.type(screen.getByLabelText(/title/i), "Backend Engineer");
    await user.type(screen.getByLabelText(/description/i), "Build APIs");
    await user.type(screen.getByLabelText(/office/i), "Paris");

    await user.click(screen.getByRole("button", { name: /create job/i }));

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Backend Engineer",
          description: "Build APIs",
          office: "Paris",
          contract_type: "FULL_TIME",
          status: "draft",
          work_mode: "onsite",
        }),
      );
    });
  });
});
