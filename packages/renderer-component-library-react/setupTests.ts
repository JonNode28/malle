import * as Enzyme from 'enzyme'
// @ts-ignore
import ReactSixteenAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new ReactSixteenAdapter(),
});

export {};