import React, {ComponentType} from 'react';
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import ErrorBoundary, {ErrorRendererProps} from "./ErrorBoundary";

function MockErrorRenderer({ err }: ErrorRendererProps){
  return <div data-testid='mock-error'>{err.message}</div>;
}

describe(`<ErrorBoundary />`, () => {

  it(`should render children when no error is raised`, () => {
    const { container } = render(
      <ErrorBoundary errorRenderer={MockErrorRenderer}>
        <div>some child</div>
      </ErrorBoundary>
    )
  });
  it(`should display the error with the defined renderer`, () => {
    function ErroringComponent(){
      throw new Error('This is an error');
      return null;
    }
    act(() => {
      render(
        <ErrorBoundary errorRenderer={MockErrorRenderer}>
          <ErroringComponent />
        </ErrorBoundary>
      );
    });
    const error = screen.getByTestId('mock-error');
    expect(error).toMatchSnapshot();
  });
});

export {};