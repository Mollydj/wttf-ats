import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Apply } from "../pages/Apply";

const { mockHandleApply } = vi.hoisted(() => ({
  mockHandleApply: vi.fn(),
}));

vi.mock("../components/ApplyForm/useApply", () => ({
  useApply: vi.fn().mockReturnValue({
    handleApply: mockHandleApply,
    loading: false,
    error: null,
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/jobs/1/apply"]}>
    <Routes>
      <Route path="/jobs/:jobId/apply" element={children} />
    </Routes>
  </MemoryRouter>
);

describe("Apply", () => {
  it("renders the form", () => {
    render(<Apply />, { wrapper });
    expect(screen.getByTestId("apply-form")).toBeVisible();
  });

  it("fills out and submits the form", async () => {
    const user = userEvent.setup();
    render(<Apply />, { wrapper });

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+33612345678");
    await user.type(screen.getByLabelText(/last known job/i), "Senior Dev");
    await user.type(screen.getByLabelText(/salary expectation/i), "80000");

    await user.click(screen.getByRole("button", { name: /apply/i }));

    await waitFor(() => {
      expect(mockHandleApply).toHaveBeenCalledWith("1", {
        full_name: "John Doe",
        email: "john@example.com",
        phone: "+33612345678",
        last_known_job: "Senior Dev",
        salary_expectation: 80000,
      });
    });
  });
});