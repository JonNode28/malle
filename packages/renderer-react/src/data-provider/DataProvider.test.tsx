import React from 'react';
import DataProvider, {useService} from "./DataProvider";
import {Service} from "./Service";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import mock = jest.mock;

describe(`<DataProvider />`, () => {
  let mockService: Service;

  function MockConsumer() {
    const service = useService();
    service.get('model-id', 'instance-id' );
    return null;
  }

  beforeEach(() => {
    mockService = {
      list: jest.fn().mockResolvedValue({
        items: [],
        count: 10,
        skip: 0,
        take: 10
      }),
      get: jest.fn().mockResolvedValue({
        item: {},
        version: 1,
        created: new Date(),
        updated: new Date(),
        deleted: false
      }),
      save: jest.fn().mockResolvedValue({
        item: {},
        version: 2,
        updated: new Date()
      }),
    };
  });

  it(`should render children`, () => {
    const { container } = render(
      <DataProvider service={mockService}>
        <div data-testid='some-child-component'>Some child component</div>
      </DataProvider>
    );
    const childComponent = screen.queryByTestId('some-child-component');
    expect(childComponent).not.toBeNull();
  });

  describe(' when using useService', () => {

    it(`should error when no provider is declared`, () => {
      expect(() => (
        render(<MockConsumer />)
      )).toThrowErrorMatchingSnapshot();
    });

    it(`should return the service passed to the provider`, () => {
      render(
        <DataProvider service={mockService}>
          <MockConsumer/>
        </DataProvider>
      );
      expect(mockService.get).toHaveBeenCalledWith('model-id', 'instance-id')
    });

  });

});


export {};