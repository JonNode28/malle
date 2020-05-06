import React from "react";
import ListRenderer from "./ListRenderer";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { ListItemProps } from "../ListItemProps";
import {PaginationProps} from "../PaginationProps";
import ModelConfig from "../ModelConfig";
import DataProvider from "../data-provider";
import mock = jest.mock;

describe('<ListRenderer />', () => {
  let baseModelConfig: ModelConfig,
  mockService: any;
  beforeEach(() => {
    baseModelConfig = {
      id: 'page',
      name: 'Page',
      properties: [
        { id: 'id', type: 'number' },
        { id: 'somethingElse', type: 'string'},
        { id: 'title', type: 'string' },
      ]
    };

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
  it('should load the first set of items', async () => {
    mockService.list.mockResolvedValue({ items: [], count: 0, skip: 0, take: 10 });
    await act( async() => {
      render(
        <DataProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={() => <div>Item</div>}
            pagination={() => <div>Page</div>}
            error={() => <div>error</div>}
          />
        </DataProvider>);
    });
    expect(mockService.list).toHaveBeenCalledWith('page', 0, 10);
  });
  it('should render items using the supplied item renderer', async () => {
    mockService.list.mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'some page name',
          somethingElse: 'blah blah blah'
        }
      ],
      count: 0,
      skip: 0,
      take: 10
    });
    const itemRenderer = ({ item }: ListItemProps) => (
      <div key={item.id} data-testid='item-renderer'>
        #{item.id} {item.title} - {item.somethingElse}
      </div>
    )
    await act( async() => {
      render(
        <DataProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={itemRenderer}
            pagination={() => <div>Page</div>}
            error={() => <div>error</div>}
          />
        </DataProvider>);
    });
    const item = screen.getByTestId('item-renderer');
    expect(item).toMatchSnapshot()
  });
  it('should render items using the supplied pagination control', async () => {
    mockService.list.mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'some page name',
          somethingElse: 'blah blah blah'
        }
      ],
      count: 0,
      skip: 0,
      take: 10
    });
    const pagination = ({ skip, take, count }: PaginationProps) => (
      <div data-testid='pagination'>
        {skip} - {take} - {count}
      </div>
    )
    await act( async() => {
      render(
        <DataProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={() => <div>Item</div>}
            pagination={pagination}
            error={() => <div>error</div>}
          />
        </DataProvider>);
    });
    const item = screen.getByTestId('pagination');
    expect(item).toMatchSnapshot()
  });
});

export {};