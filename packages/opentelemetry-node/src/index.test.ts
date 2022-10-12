import { sayHello } from './index';

test('should say hello to the world', () => {
  expect(sayHello()).toBe('Hello world!');
});
