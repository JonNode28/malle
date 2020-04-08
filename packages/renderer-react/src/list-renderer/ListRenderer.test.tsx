import React from "react";
import service from '../service';
import ListRenderer from "./ListRenderer";
import { shallow } from 'enzyme';
import { act, render } from '@testing-library/react';

jest.mock('../service');
const mockedService = service as jest.Mocked<typeof service>;

describe('<ListRenderer />', () => {
  it('should load the first set of items', async () => {
    mockedService.list.mockResolvedValue({ items: [], count: 0, skip: 0, take: 10 });
    await act( async() => {
      render(<ListRenderer config={{
        id: 'page',
        name: 'Page',
        properties: []
      }} />);
    });
    expect(service.list).toHaveBeenCalledWith('page');
  });
});

export {};