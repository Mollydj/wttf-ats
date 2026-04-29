import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { JobDetail } from "../pages/JobDetail";

const { mockJob, mockJobWithApplicants } = vi.hoisted(() => {
  const mockJob = {
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
  };

  const mockJobWithApplicants = {
    ...mockJob,
    applicants: [
      {
        id: 1,
        application_date: "2024-01-01",
        status: "new",
        salary_expectation: 80000,
        candidate: {
          id: 1,
          full_name: "John Doe",
          email: "john@example.com",
          phone: "+33612345678",
          last_known_job: "Senior Dev",
        },
      },
    ],
  };

  return { mockJob, mockJobWithApplicants };
});

vi.mock("../hooks/useJobs", () => ({
  useJob: vi.fn().mockReturnValue({
    data: mockJob,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={["/jobs/1"]}>
      <Routes>
        <Route path="/jobs/:id" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe("JobDetail", () => {
  it("renders job details", async () => {
    render(<JobDetail />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText("Backend Engineer")).toBeVisible();
      expect(screen.getByText("Build APIs")).toBeVisible();
      expect(screen.getByText("Paris")).toBeVisible();
    });
  });

  it("shows Apply button for unauthenticated users", async () => {
    render(<JobDetail />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText("Apply now")).toBeVisible();
    });
  });

  it("shows no applicants message when applicants list is empty", async () => {
    render(<JobDetail />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText("No Applicants Yet")).toBeVisible();
    });
  });

  it("shows applicants table when applicants exist", async () => {
    const { useJob } = await import("../hooks/useJobs");
    vi.mocked(useJob).mockReturnValue({
      data: mockJobWithApplicants,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<JobDetail />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeVisible();
      expect(screen.getByText("john@example.com")).toBeVisible();
    });
  });
});