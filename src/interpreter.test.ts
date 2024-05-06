import { parseExpression, parseProgram } from "../include/parser.js";
import { State, interpExpression, interpProgram } from "./interpreter.js";

function expectStateToBe(program: string, state: State) {
  expect(interpProgram(parseProgram(program))).toEqual(state);
}

describe("interpExpression", () => {
  it("evaluates multiplication with a variable", () => {
    const r = interpExpression({ x: 10 }, parseExpression("x * 2"));

    expect(r).toEqual(20);
  });
  it("throws an error when dividing by 0", () => {
    const environment = { x: 10 };
    const expression = parseExpression("x / 0");

    expect(() => {
      interpExpression(environment, expression);
    }).toThrow();
  });
  it("throws an error when comparing booleans", () => {
    const environment = { x: 10 };
    const expression = parseExpression("true > false");

    expect(() => {
      interpExpression(environment, expression);
    }).toThrow();
  });
});

describe("interpStatement", () => {
  // Tests for interpStatement go here.
});

describe("interpProgram", () => {
  it("handles declarations and reassignment", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 10;
      x = 20;
    `,
      { x: 20 }
    );
  });
  it("interperts a program using the statements", () =>
    expectStateToBe(
      `      
    let x = 0;
    x = 1;
    if( x === 1)
    {
      x = x + 2;
    }
    else {}
    if( x === 3)
    {
    x = x + 7;
    }
    else
    {
    x = x - 1;
    }
    while(x > 5)
    {
      x = x -2;
    }
    while(x === 4)
    {
      x = 3;
    }
    if(x>4)
    {
    print(x);
    }
    else
    {
      x = (3*3 < 4 || 3 > 5/5) && (3 === 3);
    }
    print(x);

  `,
      { x: true }
    ));
});
