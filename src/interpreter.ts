import { Expression, Statement } from "../include/parser.js";

type RuntimeValue = number | boolean;
export type State = { [key: string]: State | RuntimeValue | undefined };

const PARENT_STATE_KEY = "[[PARENT]]";

export function interpExpression(state: State, exp: Expression): RuntimeValue {
  // TODO
  if (exp.kind === "number") return exp.value as RuntimeValue;
  if (exp.kind === "boolean") return exp.value as RuntimeValue;
  if (exp.kind === "variable") {
    if (state[exp.name] === undefined) {
      if (state[PARENT_STATE_KEY] === undefined) throw new Error("Variable is not declared exception");
      else return interpExpression(state[PARENT_STATE_KEY] as State, exp);
    }
    return state[exp.name] as RuntimeValue;
  }
  if (exp.kind === "operator") {
    const x = interpExpression(state, exp.left);
    const y = interpExpression(state, exp.right);
    switch (exp.operator) {
      case "&&":
        if (typeof x === "boolean" && typeof y === "boolean") return x && y;
        else throw new Error("Logical operations may only happen between booleans");
      case "||":
        if (typeof x === "boolean" && typeof y === "boolean") return x || y;
        else throw new Error("Logical operations may only happen between booleans");
      case "===":
        return x === y;
      case ">":
        if (typeof x === "number" && typeof y === "number") return x > y;
        else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
      case "<":
        if (typeof x === "number" && typeof y === "number") return x < y;
        else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
      case "+":
        if (typeof x === "number" && typeof y === "number") return x + y;
        else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
      case "-":
        if (typeof x === "number" && typeof y === "number") return x - y;
        else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
      case "*":
        if (typeof x === "number" && typeof y === "number") return x * y;
        else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
      case "/":
        if (typeof x === "number" && typeof y === "number") {
          if (y === 0) throw new Error("Division by zero is forbidden");

          return x / y;
        } else throw new Error("Arithmetic and greater/less-than comparison may only happen between numbers");
    }
  }
  return false;
}

export function interpBlock(state: State, body: Statement[]): void {
  const local: State = {};
  local[PARENT_STATE_KEY] = state;
  body.forEach(smt => interpStatement(local, smt));
}

export function interpStatement(state: State, stmt: Statement): void {
  // TODO
  if (stmt.kind === "let") {
    if (state[stmt.name] === undefined) {
      state[stmt.name] = interpExpression(state, stmt.expression);
    } else throw new Error("let cannot be used on a name that is already declared");
  }
  if (stmt.kind === "assignment") {
    if (state[stmt.name] === undefined) {
      if (state[PARENT_STATE_KEY] === undefined) throw new Error("you cannot assign a value to an undeclared variable");
      else
        (state[PARENT_STATE_KEY] as State)[stmt.name] = interpExpression(
          state[PARENT_STATE_KEY] as State,
          stmt.expression
        );
    } else state[stmt.name] = interpExpression(state, stmt.expression);
  }
  if (stmt.kind === "if") {
    if (interpExpression(state, stmt.test)) interpBlock(state, stmt.truePart);
    else interpBlock(state, stmt.falsePart);
  }
  if (stmt.kind === "while") {
    while (interpExpression(state, stmt.test)) {
      interpBlock(state, stmt.body);
    }
  }
  if (stmt.kind === "print") {
    console.log(interpExpression(state, stmt.expression));
  }
}

export function interpProgram(program: Statement[]): State {
  // TODO
  const state: State = {};
  program.forEach(smt => interpStatement(state, smt));
  return state;
}
