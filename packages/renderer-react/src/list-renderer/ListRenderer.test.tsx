import React from "react";
import service from '../service';
import ListRenderer, {MalleModelConfig} from "./ListRenderer";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'

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
      render(<ListRenderer config={baseModelConfig} />);
    });
    expect(service.list).toHaveBeenCalledWith('page');
  });
  describe(`when no display.list config is defined`, () => {
    it.each([ 'name', 'Name', 'title', 'Title', 'id', 'Id', 'ID' ])(
      `should look for a prop called %p to guess as "name" text`, async (prop) => {
        mockedService.list.mockResolvedValue({
          items: [
            {
              somethingElse: 'blah blah',
              [prop]: 'Some name',
              description: 'Some descriptive text'
            }
          ],
          count: 0, skip: 0, take: 10 });
        let result;
        await act( async() => {
          result = render(<ListRenderer config={baseModelConfig} />);
        });
        const item = screen.getByTestId('item');
        expect(within(item).getByTestId('name')).toHaveTextContent('Some name');
        expect(item).toMatchSnapshot();
      });
    it.each([ 'description', 'Description' ])(
      `should look for a prop called %p to guess as "description" text`, async (prop) => {
        mockedService.list.mockResolvedValue({
          items: [
            {
              somethingElse: 'blah blah',
              name: 'Some Name',
              [prop]: 'Some descriptive text'
            }
          ],
          count: 0, skip: 0, take: 10 });
        let result;
        await act( async() => {
          result = render(<ListRenderer config={baseModelConfig} />);
        });
        const item = screen.getByTestId('item');
        expect(within(item).getByTestId('description')).toHaveTextContent('Some descriptive text');
        expect(item).toMatchSnapshot();
      });
  });

  describe(`when display.list config is defined`, () => {

    it('should use identityPaths, display.list.namePaths and display.list.descriptionPaths paths when defined', async () => {
      const modelConfig = {
        id: 'page',
        name: 'Page',
        identityPath: [ 'aSpecialId' ],
        properties: [
          { id: 'aSpecialId', name: 'Special Id', type: 'string' },
          { id: 'aSpecialName', name: 'Special Name', type: 'string' },
          { id: 'aSpecialDescription', name: 'Special Description', type: 'string' }
        ],
        display: {
          list: {
            namePath: [ 'aSpecialName' ],
            descriptionPath: [ 'aSpecialDescription' ]
          }
        }
      };
      mockedService.list.mockResolvedValue({
        items: [
          {
            aSpecialId: 1,
            aSpecialName: 'Some Special Name',
            aSpecialDescription: 'Some special descriptive text',
          }
        ],
        count: 0, skip: 0, take: 10 });
      let result;
      await act( async() => {
        result = render(<ListRenderer config={modelConfig} />);
      });
      const item = screen.getByTestId('item');
      expect(within(item).getByTestId('name')).toHaveTextContent('Some Special Name');
      expect(within(item).getByTestId('description')).toHaveTextContent('Some special descriptive text');
      expect(item).toMatchSnapshot();
    });

    it(`should use 'render' method when defined`, async () => {
      baseModelConfig.display = {
        list: {
          render: ({ id, name, description }) => <div key={id} className='custom-ui-for-list-items' data-testid='item'>{name + description}</div>
        }
      };
      mockedService.list.mockResolvedValue({
        items: [
          {
            id: 'some-id',
            somethingElse: 'blah blah',
            name: 'Some name',
            description: 'Some descriptive text'
          }
        ],
        count: 0, skip: 0, take: 10 });
      await act( async() => {
        render(<ListRenderer config={baseModelConfig} />);
      });
      const item = screen.getByTestId('item');
      expect(item).toMatchSnapshot();
    });

  });

  it(`should render the custom view if defined`, async() => {

  });
});

export {};