import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Spinner from "./Spinner";

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

let spinnerOn = true;

beforeEach(() => {
  render(<Spinner on={spinnerOn} />);
});

afterEach(() => {
  window.localStorage.clear();
});

describe("Spinner component", () => {
  test("sanity", () => {
    expect(true).toBe(true);
  });

  test("Spinner has no errors when true", async () => {
    render(<Spinner on={spinnerOn} />);
  });

  test("Spinner has no errors when false", async () => {
    spinnerOn = false;
    render(<Spinner on={spinnerOn} />);
  });
});
