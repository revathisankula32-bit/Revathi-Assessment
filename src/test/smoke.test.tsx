import { render, screen } from "@testing-library/react";
import React from "react";

function Hello() {
  return <h1>Hello Test</h1>;
}

it("renders a simple component", () => {
  render(<Hello />);
  expect(screen.getByText("Hello Test")).toBeInTheDocument();
});
