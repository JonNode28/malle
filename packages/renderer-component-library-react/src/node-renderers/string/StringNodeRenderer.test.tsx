import React from "react";
import { act, render, within, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import StringRenderer from "./StringNodeRenderer";

describe(`<StringRenderer />`, () => {
  it(`should render correctly`, () => {
    const { container } = render(<StringRenderer
      propertyConfig={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'Unnamed'
      }}
      displayConfig={{
        type: 'property',
      }}
      data={{
        name: 'Foo Bar'
      }}
      onChange={() => {}}
    />);
    expect(container).toMatchSnapshot();
  });
  it(`should render correctly when no description is available`, () => {
    const { container } = render(<StringRenderer
      propertyConfig={{
        id: 'name',
        name: 'Name',
        type: 'string',
        default: 'Unnamed'
      }}
      displayConfig={{
        type: 'property',
      }}
      data={{
        name: 'Foo Bar'
      }}
      onChange={() => {}}
    />);
    expect(container).toMatchSnapshot();
  });
  it(`should call the onChange function when user types something`, () => {
    const onChangeMock = jest.fn();
    const { container } = render(<StringRenderer
      propertyConfig={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'Unnamed'
      }}
      displayConfig={{
        type: 'property',
      }}
      data={{
        name: 'Foo Bar',
        age: 23
      }}
      onChange={onChangeMock}
    />);
    fireEvent.change(screen.getByTestId('string-input'), { target: { value: 'a' } })
    expect(onChangeMock).toHaveBeenCalledWith({ name: 'a', age: 23 })
  });
  it(`should error when no property config is passed`, () => {
    expect(() => {
      // @ts-ignore
      render(<StringRenderer
        displayConfig={{
          type: 'property',
        }}
        data={{
          name: 'Foo Bar',
          age: 23
        }}
        onChange={() => {}}
      />);
    }).toThrowErrorMatchingSnapshot();
  });
  it(`should error when no onChange callback is passed`, () => {
    expect(() => {
      // @ts-ignore
      render(<StringRenderer
        propertyConfig={{
          id: 'name',
          name: 'Name',
          description: 'The name',
          type: 'string',
          default: 'Unnamed'
        }}
        displayConfig={{
          type: 'property',
        }}
        data={{
          name: 'Foo Bar',
          age: 23
        }}
      />);
    }).toThrowErrorMatchingSnapshot();
  });
})

export {};