import "mocha";
import { assert } from "chai";

import npmPackage, { sayHello, sayGoodBye } from "../src/index";

describe("NPM Package", () => {
  it("should be an object", () => {
    assert.isObject(npmPackage);
  });

  it("should have a sayHello property", () => {
    assert.property(npmPackage, "sayHello");
  });
});

describe("Hello World Function", () => {
  it("should be a function", () => {
    assert.isFunction(sayHello);
  });

  it("should return the hello world message", () => {
    const expected = "Hello";
    const actual = sayHello();
    assert.equal(actual, expected);
  });
});

describe("Goodbye Function", () => {
  it("should be a function", () => {
    assert.isFunction(sayGoodBye);
  });

  it("should return the goodbye message", () => {
    const expected = "GoodBye";
    const actual = sayGoodBye();
    assert.equal(actual, expected);
  });
});
