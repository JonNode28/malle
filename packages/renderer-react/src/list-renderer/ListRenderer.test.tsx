import React from "react";
import service from '../service';
import ListRenderer, {MalleModelConfig} from "./ListRenderer";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { ListItemProps } from "../ListItemProps";
import {PaginationProps} from "../PaginationProps";

jest.mock('../service');
const mockedService = service as jest.Mocked<typeof service>;

describe('<ListRenderer />', () => {
  let baseModelConfig: MalleModelConfig;
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
  });
  it('should load the first set of items', async () => {
    mockedService.list.mockResolvedValue({ items: [], count: 0, skip: 0, take: 10 });
    await act( async() => {
      render(<ListRenderer
        config={baseModelConfig}
        itemRenderer={() => <div>Item</div>}
        pagination={() => <div>Page</div>} />);
    });
    expect(service.list).toHaveBeenCalledWith('page', 0, 10);
  });
  it('should render items using the supplied item renderer', async () => {
    mockedService.list.mockResolvedValue({
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
      render(<ListRenderer
        config={baseModelConfig}
        itemRenderer={itemRenderer}
        pagination={() => <div>Page</div>} />);
    });
    const item = screen.getByTestId('item-renderer');
    expect(item).toMatchSnapshot()
  });
  it('should render items using the supplied pagination control', async () => {
    mockedService.list.mockResolvedValue({
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
      render(<ListRenderer
        config={baseModelConfig}
        itemRenderer={() => <div>Item</div>}
        pagination={pagination} />);
    });
    const item = screen.getByTestId('pagination');
    expect(item).toMatchSnapshot()
  });
});

export {};