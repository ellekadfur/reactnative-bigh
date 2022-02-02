import React from 'react';
import {render} from '@testing-library/react-native';
import {expect} from '@jest/globals';

import App from '../App';

describe('<App />', () => {
  test('has button', () => {
    const screen = render(<App />);
    expect(screen.getByTestId('CalculateButton')).toBeTruthy();
  });
  test('is result present', () => {
    const screen = render(<App />);
    expect(screen.getByTestId('result')).toBeTruthy();
  });
  test('has title', () => {
    const screen = render(<App />);
    expect(screen.getByText(/Big Health/)).toBeTruthy();
  });
});
