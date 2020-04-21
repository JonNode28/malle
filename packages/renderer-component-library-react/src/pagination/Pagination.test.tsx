import React from "react";
import { act, render, within, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import Pagination from "./Pagination";


describe(`<Pagination />`, () => {
  it(`should render the correct number of clickable pages`, () => {
    const { container } = render(<Pagination skip={0} take={10} count={21} onChange={() => {}}/>);
    expect(screen.getAllByTestId('page').length).toBe(2);
  });
  it(`should display the correct page as current`, () => {
    const { container } = render(<Pagination skip={10} take={10} count={21} onChange={() => {}}/>);
    expect(screen.getByTestId('current-page').textContent).toBe('2');
  });
  it(`should call the callback function when a new page is selected`, () => {
    const mockCallback = jest.fn();
    const { container } = render(<Pagination skip={10} take={10} count={21} onChange={mockCallback}/>);
    const pages = screen.getByTestId('pages');
    fireEvent.click(within(pages).getByText('1'));
    expect(mockCallback).toHaveBeenCalledWith(0, 10);
  });
});
export {};