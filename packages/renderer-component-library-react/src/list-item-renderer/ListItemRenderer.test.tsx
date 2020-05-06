import React from "react";
import ListItemRenderer from "./ListItemRenderer";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { shallow } from 'enzyme';

describe('<ListItem />', () => {

  describe(`when no paths are passed in`, () => {

    it.each([ 'name', 'Name', 'title', 'Title', 'id', 'Id', 'ID' ])(
      `should look for a property called %p to guess as title`, async (prop) => {
        const { container } = render(<ListItemRenderer item={{
          somethingElse: 'blah blah',
          [prop]: 'Some name',
          description: 'Some descriptive text'
        }} />);
        expect(screen.getByTestId('item-title')).toHaveTextContent('Some name');
        expect(container).toMatchSnapshot();
      });

    it.each([ 'description', 'Description' ])(
      `should look for a property called %p to guess as subtext`, async (prop) => {
        const { container } = render(<ListItemRenderer item={{
          somethingElse: 'blah blah',
          name: 'Some Name',
          [prop]: 'Some descriptive text'
        }}/>);
        expect(screen.getByTestId('item-subtext')).toHaveTextContent('Some descriptive text');
        expect(container).toMatchSnapshot();
      });

  });

  it('should use idPath, titlePath and subtextPath when defined', async () => {
    render(<ListItemRenderer
      idPath={[ 'aSpecialId' ]}
      titlePath={[ 'aSpecialName' ]}
      subtextPath={[ 'aSpecialDescription' ]}
      item={{
        aSpecialId: 'some-special-id',
        aSpecialName: 'Some Special Name',
        aSpecialDescription: 'blah blah special blah',
      }}
    />);
    expect(screen.getByTestId('item-title')).toHaveTextContent('Some Special Name');
    expect(screen.getByTestId('item-subtext')).toHaveTextContent('blah blah special blah');
  });

});

export {};