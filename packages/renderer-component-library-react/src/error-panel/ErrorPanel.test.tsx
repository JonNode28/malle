import { act, render, within, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import React from "react";
import ErrorPanel from "./ErrorPanel";

describe(`<ErrorPanel />`, () => {
  it(`should display the error message`, () => {
    render(<ErrorPanel err={{ message: 'some error message' }} />);
    const errorPanel = screen.getByTestId('error-panel');
    expect(errorPanel.textContent).toMatchSnapshot();
  });
  it(`should display a default message if no error is provided`, () => {
    render(<ErrorPanel err={null} />);
    const errorPanel = screen.getByTestId('error-panel');
    expect(errorPanel.textContent).toMatchSnapshot();
  });
  it(`should display a default message if no error message is provided`, () => {
    render(<ErrorPanel err={{}} />);
    const errorPanel = screen.getByTestId('error-panel');
    expect(errorPanel.textContent).toMatchSnapshot();
  });
});

export {};