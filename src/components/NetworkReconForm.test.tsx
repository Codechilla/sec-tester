import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NetworkReconForm from "./NetworkReconForm";

describe("NetworkReconForm", () => {
	beforeAll(() => {
		global.fetch = (url, opts) => {
			console.log('FETCH CALLED:', url);
			if (url === "/api/network-recon") {
				const body = JSON.parse(typeof opts.body === "string" ? opts.body : "{}") || {};
				const targets = Array.isArray(body.targets) ? body.targets : [];
				const responseInit = { status: targets.length ? 200 : 400 };
				const responseBody = targets.length
					? { status: "initiated", targets, scan_type: body.scan_type }
					: { detail: "No targets provided." };
				class Headers {
					get() { return 'application/json'; }
					append() {}
					delete() {}
					has() { return true; }
					set() {}
					entries() { return []; }
					forEach() {}
					keys() { return []; }
					values() { return []; }
				}
				return Promise.resolve({
					ok: responseInit.status === 200,
					status: responseInit.status,
					statusText: responseInit.status === 200 ? 'OK' : 'Bad Request',
					url,
					redirected: false,
					type: 'basic',
					headers: new Headers(),
					json: async () => responseBody,
					text: async () => JSON.stringify(responseBody),
					clone: () => this,
					body: null,
					bodyUsed: false,
					arrayBuffer: async () => new ArrayBuffer(0),
					blob: async () => new Blob(),
					formData: async () => new FormData()
				} as any);
			}
			return Promise.reject("Unknown endpoint");
		};
	});

	afterAll(() => {
		// @ts-ignore
		global.fetch = undefined;
	});

	test("renders form and submits successfully", async () => {
		render(<NetworkReconForm />);
		fireEvent.change(screen.getByLabelText(/Targets/i), { target: { value: "192.168.1.1,10.0.0.1" } });
		fireEvent.change(screen.getByLabelText(/Scan Type/i), { target: { value: "advanced" } });
		fireEvent.click(screen.getByRole("button", { name: /Start Scan/i }));
		await waitFor(() => screen.getByText(/Status: initiated/i));
		expect(screen.getByText(/Targets: 192.168.1.1, 10.0.0.1/i)).toBeInTheDocument();
		expect(screen.getByText(/Scan Type: advanced/i)).toBeInTheDocument();
	});

	test("shows error when no targets provided", async () => {
		render(<NetworkReconForm />);
		fireEvent.change(screen.getByLabelText(/Targets/i), { target: { value: "   " } });
		fireEvent.click(screen.getByRole("button", { name: /Start Scan/i }));
			const errorMsg = await screen.findByText(/Error: No targets provided./i);
			expect(errorMsg).toBeInTheDocument();
	});
});
