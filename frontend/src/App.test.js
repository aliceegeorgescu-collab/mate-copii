import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 401,
    text: async () => JSON.stringify({ error: "Autentificare necesara." }),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders the login screen when user is not authenticated", async () => {
  render(<App />);

  expect(await screen.findByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText("******")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /matematica magica online/i })).toBeInTheDocument();
});
