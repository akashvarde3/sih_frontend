import { render } from '@testing-library/react';

// Basic smoke test to ensure the test runner is wired up.
test('app shell renders without crashing', () => {
  const { container } = render(<div>Farmer dashboard</div>);
  expect(container.textContent).toContain('Farmer');
});
