import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Simple Notes UI", () => {
  render(<App />);
  expect(screen.getByText(/simple notes/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /new note/i })).toBeInTheDocument();
});
