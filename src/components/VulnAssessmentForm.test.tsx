import "@testing-library/jest-dom";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VulnAssessmentForm from "./VulnAssessmentForm";

global.fetch = jest.fn();

describe("VulnAssessmentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form and submits successfully", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: "initiated", targets: ["192.168.1.1"], scan_type: "cve-scan" })
    });
    render(<VulnAssessmentForm />);
    fireEvent.change(screen.getByPlaceholderText(/192.168.1.1/), { target: { value: "192.168.1.1" } });
    fireEvent.click(screen.getByText(/Start Assessment/));
    await waitFor(() => expect(screen.getByText(/Status: initiated/)).toBeInTheDocument());
    expect(screen.getByText(/Targets: 192.168.1.1/)).toBeInTheDocument();
    expect(screen.getByText(/Scan Type: cve-scan/)).toBeInTheDocument();
  });

  it("shows error if no targets entered", async () => {
    render(<VulnAssessmentForm />);
    fireEvent.change(screen.getByPlaceholderText(/192.168.1.1/), { target: { value: "   " } });
    fireEvent.click(screen.getByText(/Start Assessment/));
    await waitFor(() => expect(screen.getByText(/Please enter at least one target/)).toBeInTheDocument());
  });

  it("shows backend error response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "No targets provided." })
    });
    render(<VulnAssessmentForm />);
    fireEvent.change(screen.getByPlaceholderText(/192.168.1.1/), { target: { value: "192.168.1.1" } });
    fireEvent.click(screen.getByText(/Start Assessment/));
    await waitFor(() => expect(screen.getByText(/No targets provided/)).toBeInTheDocument());
  });

  it("shows network error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    render(<VulnAssessmentForm />);
    fireEvent.change(screen.getByPlaceholderText(/192.168.1.1/), { target: { value: "192.168.1.1" } });
    fireEvent.click(screen.getByText(/Start Assessment/));
    await waitFor(() => expect(screen.getByText(/Network error/)).toBeInTheDocument());
  });
});
