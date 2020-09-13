import React, { ComponentType, Fragment } from "react";
import { act, fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import EditRenderer from "./EditRenderer";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import DataProvider from "../data-provider";
import { ModelConfig, ValidationExecutionStage } from "microo-core";

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
      'string': ( { data, propertyConfig, onChange, validationResults }: PropertyTypeRendererProps ) => (
        <Fragment>
          <input
            data-testid={`property-${propertyConfig.id}`}
            value={data[propertyConfig.id]}
            onChange={(e) => {
              onChange && onChange({
                ...data,
                [propertyConfig.id]: e.currentTarget.value
              });
            }} />
          {validationResults && validationResults.map((result, i) => !result.valid && (
            <div data-testid='validation-result' key={i}>{result.errorMessage}</div>
          ))}
        </Fragment>
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
            <EditRenderer modelConfig={baseConfig} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
          </DataProvider>);
      });

      const idProp = screen.getByTestId('property-id');
      expect(idProp).toHaveValue('a-generated-id');
      const titleProp = screen.getByTestId('property-title');
      expect(titleProp).toHaveValue('Untitled');
    });
  });
  describe(`when editing an existing item`, () => {
    it(`should load the item to edit`, async () => {
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer modelConfig={baseConfig} id={123} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
          </DataProvider>
          );
      });
      expect(mockService.get).toHaveBeenCalledWith('page', 123);
    });
    it(`should display an appropriate error when it can't find item with the specified ID`, async () => {
      mockService.get.mockResolvedValue({
        item: null
      });
      await act(async() => {
        render(
          <DataProvider service={mockService}>
            <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
            <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
        </DataProvider>);
    });
    const idProp = screen.getByTestId('property-id');
    expect(idProp).toHaveValue('some-id');
    const titleProp = screen.getByTestId('property-title');
    expect(titleProp).toHaveValue('Some Page Title');
  });
  it(`should show loading UI to begin with`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
        </DataProvider>);
      const loading = screen.queryByTestId('loading');
      expect(loading?.textContent).toMatchSnapshot();
    });
  });
  it(`should hide the loading UI once item has been loaded`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
            modelConfig={baseConfig}
            propertyTypeRenderers={propertyTypeRenderers}
            displayTypeRenderers={{
              'column': ({ data, displayConfig, renderChildren}) => (
                <div data-testid='col'>{displayConfig.children && renderChildren && renderChildren(displayConfig.children)}</div>
              )
            }}
            cancel={() => {}}/>
        </DataProvider>);
    });
    const column = screen.getByTestId('col');
    expect(column).toMatchSnapshot();
  });
  it(`should use the provided error renderer when provided`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            // @ts-ignore
              modelConfig={null} id={'some-id'}
              propertyTypeRenderers={propertyTypeRenderers}
              errorRenderer={() => <div data-testid='custom-error'>A custom error display component</div>}
              cancel={() => {}} />
        </DataProvider>);
    });
    const error = screen.getByTestId('custom-error');
    expect(error?.textContent).toBe('A custom error display component');
  });
  it(`should display an appropriate error when no model configuration is provided`, async () => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          // @ts-ignore
          <EditRenderer modelConfig={null} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error.textContent).toMatchSnapshot();
  });
  it(`should display an appropriate error when no cancel function is provided`, async() => {
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          // @ts-ignore
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error.textContent).toMatchSnapshot();
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
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
        </DataProvider>);
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should display an appropriate error when a property type renderer errors`, async () => {
    propertyTypeRenderers['erroring-type-renderer'] = () => {
      throw new Error('A property type renderer error!');
    };
    baseConfig.properties.push({
      id: 'erroring',
      name: 'Erroring',
      type: 'erroring-type-renderer'
    });
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
        </DataProvider>
      );
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should display an appropriate error when a display type renderer errors`, async () => {
    baseConfig.display = {
      edit: [
        {
          type: 'erroring-display-type-renderer'
        }
      ]
    }
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            id={'some-id'}
            propertyTypeRenderers={propertyTypeRenderers}
            displayTypeRenderers={{
              'erroring-display-type-renderer':  () => {
                throw new Error('A display type renderer error!');
              }
            }}
            cancel={() => {}} />
        </DataProvider>
      );
    });
    const error = screen.getByTestId('error');
    expect(error?.textContent).toMatchSnapshot();
  });
  it(`should save the model instance when the form submits`, async () => {
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
          <EditRenderer modelConfig={baseConfig} id={'some-id'} propertyTypeRenderers={propertyTypeRenderers} cancel={() => {}} />
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
  it(`should call the onSaved callback after saving`, async () => {
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
    const mockOnSaved = jest.fn();
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            id={'some-id'}
            propertyTypeRenderers={propertyTypeRenderers}
            cancel={() => {}}
            onSaved={mockOnSaved} />
        </DataProvider>);
    });
    await act(async() => {
      fireEvent.submit(screen.getByTestId('form'));
    });
    expect(mockOnSaved).toHaveBeenCalledWith('page', {
      id: 'some-id',
      title: 'Some Page Title'
    });
  });
  it(`should call the cancel callback when the cancel button is clicked`, async () => {
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
    const mockCancel = jest.fn();
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            id={'some-id'}
            propertyTypeRenderers={propertyTypeRenderers}
            cancel={mockCancel}/>
        </DataProvider>);
    });
    fireEvent.click(screen.getByTestId('cancel'));
    expect(mockCancel).toHaveBeenCalledWith('page', {
      id: 'some-id',
      title: 'Some Page Title'
    });
  });
  it(`should show an immediate validation error when invalid data is entered`, async () => {
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
    const validationFn = jest.fn();
    baseConfig.properties[1].validation = {
      executeOn: [ ValidationExecutionStage.CHANGE ],
      execute: validationFn
    };
    validationFn.mockResolvedValue({
      valid: false,
      errorMessage: 'some validation error'
    });
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            id={'some-id'}
            propertyTypeRenderers={propertyTypeRenderers}
            cancel={() => {}}/>
        </DataProvider>);
    });
    await act(async() => {
      fireEvent.change(screen.getByTestId('property-title'), { target: { value: '' } });
    });
    expect(screen.getByTestId('validation-result').textContent).toMatchSnapshot();
  });
  it(`should show validation errors when saving a new instance`, async () => {
    baseConfig.properties[1].validation = {
      executeOn: [ ValidationExecutionStage.CLIENT_CREATE ],
      execute: () => Promise.resolve({
        valid: false,
        errorMessage: 'some validation error'
      })
    };
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            propertyTypeRenderers={propertyTypeRenderers}
            cancel={() => {}}/>
        </DataProvider>);
    });

    await act(async() => {
      fireEvent.change(screen.getByTestId('property-title'), { target: { value: '' } });
      fireEvent.click(screen.getByTestId('save'));
    });

    expect(screen.getByTestId('validation-result').textContent).toMatchSnapshot();
  });
  it(`should show validation errors when saving an existing instance`, async () => {
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
    baseConfig.properties[1].validation = {
      executeOn: [ ValidationExecutionStage.CLIENT_UPDATE ],
      execute: () => Promise.resolve({
        valid: false,
        errorMessage: 'some validation error'
      })
    };
    await act(async() => {
      render(
        <DataProvider service={mockService}>
          <EditRenderer
            modelConfig={baseConfig}
            propertyTypeRenderers={propertyTypeRenderers}
            id={'some-id'}
            cancel={() => {}} />
        </DataProvider>);
    });

    await act(async() => {
      fireEvent.change(screen.getByTestId('property-title'), { target: { value: '' } });
      fireEvent.click(screen.getByTestId('save'));
    });

    expect(screen.getByTestId('validation-result').textContent).toMatchSnapshot();
  });
  it(`should not save when validation errors are present`, () => {

  });
});

export {};