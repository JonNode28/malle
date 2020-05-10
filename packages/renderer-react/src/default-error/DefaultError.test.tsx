import React from "react";
import { act, render, within, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import DefaultError from "./DefaultError";

describe(`<DefaultError />`, () => {
  it(`should render string errors`, () => {
    render(<DefaultError err={'This is a string error'} />);
    expect(screen.getByTestId('error').textContent).toMatchSnapshot();
  });
  it(`should render Error messages`, () => {
    render(<DefaultError err={new Error('This is an Error error')} />);
    expect(screen.getByTestId('error').textContent).toMatchSnapshot();
  });
  it(`should fallback if incorrect error param is passed`, () => {
    // @ts-ignore
    render(<DefaultError err={{ foo: 'bar' }} />);
    expect(screen.getByTestId('error').textContent).toMatchSnapshot();
  });
});

export {};