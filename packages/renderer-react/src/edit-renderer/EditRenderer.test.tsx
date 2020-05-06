import React, {ComponentType} from "react";
import EditRenderer from "./EditRenderer";
import { act, render, within, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import {PropertyConfig} from "../PropertyConfig";
import ModelConfig from "../ModelConfig";
import {prop} from "ramda";
import {TypeRendererProps} from "./TypeRendererProps";
import {PropertyTypeRendererProps} from "./PropertyTypeRendererProps";
import DataProvider from "../data-provider";

describe(`<EditRenderer />`, () => {
  let baseConfig: ModelConfig,
    propertyTypeRenderers: { [typeId: string]: ComponentType<PropertyTypeRendererProps> },
    mockService: any;

  beforeEach(() => {
    baseConfig = {
      id: 'page',
      name: 'Page',
      properties: [
        {
          id: 'id',
          name: 'ID',
          type: 'string',
          default: () => {
            return 'a-generated-id'
          }
        },
        {
          id: 'title',
          name: 'Title',
          type: 'string',
          default: 'Untitled'
        }
      ]
    };
    propertyTypeRenderers = {
      'string': ( { data, propertyConfig, onChange }: PropertyTypeRendererProps ) => (
        <div data-testid={`property-${propertyConfig.id}`}>{data[propertyConfig.id]}</div>
      )
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`when editing a new item`, () => {
    it(`should initialise the model instance with default values`, async () => {
      baseConfig.properties[0].default = () => {
        return 'a-generated-id'
      };
      baseConfig.properties[1].default = 'Untitled';

      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer config={baseConfig} propertyTypeRenderers={propertyTypeRenderers}/>
          </DataProvider>);
      });

      const idProp = screen.getByTestId('property-id');
      expect(idProp).toHaveTextContent('a-generated-id');
      const titleProp = screen.getByTestId('property-title');
      expect(titleProp).toHaveTextContent('Untitled');
    });
  });
  describe(`when editing an existing item`, () => {
    it(`should load the item to edit`, async () => {
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer config={baseConfig} id={123} propertyTypeRenderers={propertyTypeRenderers} />
          </DataProvider>
          );
      });
      expect(mockService.get).toHaveBeenCalledWith('page', 123);
    });
    it(`should display an appropriate error when no model configuration is provided`, async () => {
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            // @ts-ignore
            <EditRenderer config={null} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
          </DataProvider>);
      });
      const error = screen.getByTestId('error');
      expect(error.textContent).toMatchSnapshot();
    });
    it(`should display an appropriate error when it can't find item with the specified ID`, async () => {
      mockService.get.mockResolvedValue({
        item: null
      });
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
          </DataProvider>);
      });
      const error = screen.getByTestId('error');
      expect(error.textContent).toMatchSnapshot();
    });
    it(`should display an appropriate error when service can't load data`, async () => {
      mockService.get.mockRejectedValue({ message: 'some error message' });
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
          </DataProvider>);
      });
      const error = screen.getByTestId('error');
      expect(error.textContent).toMatchSnapshot();
    });
  });
  it(`should render the UI to edit each property`, async () => {
    mockService.get.mockResolvedValue({
      item: {
        id: 'some-id',
        title: 'Some Page Title'
      },
      version: 1,
      created: new Date(),
      updated: new Date(),
      deleted: false
    })
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const idProp = screen.getByTestId('property-id');
    expect(idProp).toHaveTextContent('some-id');
    const titleProp = screen.getByTestId('property-title');
    expect(titleProp).toHaveTextContent('Some Page Title');
  });
  it(`should show loading UI to begin with`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
      const loading = screen.queryByTestId('loading');
      expect(loading?.textContent).toMatchSnapshot();
    });
  });
  it(`should hide the loading UI once item has been loaded`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const loading = screen.queryByTestId('loading');
    expect(loading).toBeNull();
  });
  it(`should render the UI for non-property display config`, async () => {
    baseConfig.display = {
      edit: [
        {
          type: 'column',
          children: [
            { type: 'property', options: { property: 'title' }}
          ]
        }
      ]
    };
    await act(async () => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            config={baseConfig}
            propertyTypeRenderers={propertyTypeRenderers}
            typeRenderers={{
              'column': ({ data, displayConfig, renderChildren}) => (
                <div data-testid='col'>{displayConfig.children && renderChildren(displayConfig.children)}</div>
              )
            }}/>
        </DataProvider>);
    });
    const column = screen.getByTestId('col');
    expect(column).toMatchSnapshot();
  });
  it(`should display an appropriate error when a property display config doesn't match a property`, async () => {
    mockService.get.mockResolvedValue({
      item: {
        id: 'some-id',
        title: 'Some Page Title'
      },
      version: 1,
      created: new Date(),
      updated: new Date(),
      deleted: false
    })
    baseConfig.display = {
      edit: [
        'some-weird-unknown-prop'
      ]
    }
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should display an appropriate error when it can't find the correct property type renderer`, async () => {
    mockService.get.mockResolvedValue({
      item: {
        id: 'some-id',
        title: 'Some Page Title'
      },
      version: 1,
      created: new Date(),
      updated: new Date(),
      deleted: false
    })
    baseConfig.properties.push({
      id: 'prop-of-unknown-type',
      name: 'Prop of unknown type',
      type: 'rainbow'
    })
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should display an appropriate error when it can't find the correct non-property type renderer`, async () => {
    mockService.get.mockResolvedValue({
      item: {
        id: 'some-id',
        title: 'Some Page Title'
      },
      version: 1,
      created: new Date(),
      updated: new Date(),
      deleted: false
    });
    baseConfig.display = {
      edit: [
        {
          type: 'column'
        }
      ]
    }
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should save the model instance when the form submits (either with enter key or clicking Save)`, async () => {
    mockService.get.mockResolvedValue({
      item: {
        id: 'some-id',
        title: 'Some Page Title'
      },
      version: 1,
      created: new Date(),
      updated: new Date(),
      deleted: false
    });
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer config={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    fireEvent.submit(screen.getByTestId('form'));
    expect(mockService.save).toHaveBeenCalledWith(
      'page',
      {
        id: 'some-id',
        title: 'Some Page Title'
      });
  });
});

export {};