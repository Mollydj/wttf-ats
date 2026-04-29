import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UpdateJob } from "../pages/UpdateJob";
import type { UseMutationResult } from "@tanstack/react-query";

const { mockHandleUpdate } = vi.hoisted(() => ({
  mockHandleUpdate: vi.fn(),
}));

vi.mock("../hooks/useJobs", () => ({
  useJob: vi.fn().mockReturnValue({
    data: {
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
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("../hooks/useUpdateJob", () => ({
  useUpdateJob: vi.fn().mockReturnValue({
    mutate: mockHandleUpdate,
    isPending: false,
    isError: false,
  } as unknown as UseMutationResult<void, Error, string | number, unknown>),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={["/jobs/1/update"]}>
      <Routes>
        <Route path="/jobs/:id/update" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe("UpdateJob", () => {
  it("renders with pre-filled job data", async () => {
    render(<UpdateJob />, { wrapper });
    await waitFor(() => {
      expect(screen.getByDisplayValue("Backend Engineer")).toBeVisible();
      expect(screen.getByDisplayValue("Build APIs")).toBeVisible();
      expect(screen.getByDisplayValue("Paris")).toBeVisible();
    });
  });

  it("submits updated job data", async () => {
    const user = userEvent.setup();
    render(<UpdateJob />, { wrapper });

    await waitFor(() => screen.getByDisplayValue("Backend Engineer"));

    const titleInput = screen.getByDisplayValue("Backend Engineer");
    await user.clear(titleInput);
    await user.type(titleInput, "Senior Backend Engineer");

    await user.click(screen.getByRole("button", { name: /update job/i }));

    await waitFor(() => {
      expect(mockHandleUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Senior Backend Engineer" })
      );
    });
  });
});