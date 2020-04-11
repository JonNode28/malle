import React from "react";
import ListItemRenderer from "./ListItem";
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
        const item = screen.getByTestId('item');
        expect(screen.getByTestId('title')).toHaveTextContent('Some name');
        expect(container).toMatchSnapshot();
      });

    it.each([ 'description', 'Description' ])(
      `should look for a property called %p to guess as subtext`, async (prop) => {
        const { container } = render(<ListItemRenderer item={{
          somethingElse: 'blah blah',
          name: 'Some Name',
          [prop]: 'Some descriptive text'
        }}/>);
        expect(screen.getByTestId('subtext')).toHaveTextContent('Some descriptive text');
        expect(container).toMatchSnapshot();
      });

    it.each(['id', 'Id', 'ID'])(
      `should look for a property called %p to guess as ID`, async (prop) => {
        const wrapper = shallow(<ListItemRenderer item={{
          [prop]: 'some-id',
          name: 'Some Name',
          somethingElse: 'blah blah',
        }}/>);
        expect(wrapper.find(`div[data-testid='item']`).key()).toBe('some-id');
      });

  });

  it('should use idPath, titlePath and subtextPath when defined', async () => {
    const ListItem = <ListItemRenderer
      idPath={[ 'aSpecialId' ]}
      titlePath={[ 'aSpecialName' ]}
      subtextPath={[ 'aSpecialDescription' ]} />
    // render(<ListItem item);
    const item = screen.getByTestId('item');
    expect(within(item).getByTestId('title')).toHaveTextContent('Some Special Name');
    expect(within(item).getByTestId('subtext')).toHaveTextContent('Some special descriptive text');
    expect(item).toMatchSnapshot();
  });

});

export {};