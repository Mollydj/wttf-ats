import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { JobList } from "../pages/JobList";
import userEvent from "@testing-library/user-event";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);


beforeEach(() => {
  vi.mock("../hooks/useJobs", () => ({
    useJobs: vi.fn().mockReturnValue({
      data: [
        {
          id: 1,
          title: "Backend Engineer",
          description: "Build APIs",
          contract_type: "FULL_TIME",
          office: "Paris",
          status: "published",
          work_mode: "remote",
          profession_id: 1,
          profession: null,
          applicants: [],
          inserted_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
        {
          id: 2,
          title: "Frontend Engineer",
          description: "Build Components",
          contract_type: "FULL_TIME",
          office: "London",
          status: "published",
          work_mode: "hybrid",
          profession_id: 1,
          profession: null,
          applicants: [],
          inserted_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
      isLoading: false,
      isError: false,
    }),
  }));
});

vi.mock("../hooks/useDeleteJob", () => ({
  useDeleteJob: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

vi.mock("../hooks/useMe", () => ({
  useMe: vi.fn().mockReturnValue({
    user: null,
    hasBearerToken: false,
    isLoading: false,
    clearUser: vi.fn(),
  }),
}));

describe("JobList for authenticated users", () => {
  it("deletes a job when Delete is clicked", async () => {
    const { useMe } = await import("../hooks/useMe");
    const { useDeleteJob } = await import("../hooks/useDeleteJob");
    const mockMutate = vi.fn();

    vi.mocked(useMe).mockReturnValue({
      user: { id: "1", email: "test@test.com" },
      hasBearerToken: true,
      isLoading: false,
      clearUser: vi.fn(),
    });

    vi.mocked(useDeleteJob).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    } as unknown as UseMutationResult<void, Error, string | number, unknown>);

    vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));

    const user = userEvent.setup();
    render(<JobList />, { wrapper });

    const deleteButton = await waitFor(() => {
      const buttons = screen.getAllByText("Delete");
      expect(buttons.length).toBeGreaterThan(0);
      return buttons[0];
    });
    await user.click(deleteButton as Element);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(1);
    });
  });
});
