function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (char === ' ') {
      i += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let number = char;
      i += 1;
      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        number += expression[i];
        i += 1;
      }
      tokens.push(number);
      continue;
    }

    if ('+-*/()'.includes(char)) {
      tokens.push(char);
      i += 1;
      continue;
    }

    return [];
  }

  return tokens;
}

function parsePrimary(tokens: string[], index: { current: number }): number {
  const token = tokens[index.current];

  if (token === '(') {
    index.current += 1;
    const value = parseExpression(tokens, index);
    if (tokens[index.current] !== ')') {
      throw new Error('Mismatched parentheses');
    }
    index.current += 1;
    return value;
  }

  if (token === '-') {
    index.current += 1;
    return -parsePrimary(tokens, index);
  }

  if (token === '+') {
    index.current += 1;
    return parsePrimary(tokens, index);
  }

  const value = Number(token);
  if (Number.isNaN(value)) {
    throw new Error('Invalid number');
  }

  index.current += 1;
  return value;
}

function parseTerm(tokens: string[], index: { current: number }): number {
  let value = parsePrimary(tokens, index);

  while (index.current < tokens.length && (tokens[index.current] === '*' || tokens[index.current] === '/')) {
    const operator = tokens[index.current];
    index.current += 1;
    const right = parsePrimary(tokens, index);
    value = operator === '*' ? value * right : value / right;
  }

  return value;
}

function parseExpression(tokens: string[], index: { current: number }): number {
  let value = parseTerm(tokens, index);

  while (index.current < tokens.length && (tokens[index.current] === '+' || tokens[index.current] === '-')) {
    const operator = tokens[index.current];
    index.current += 1;
    const right = parseTerm(tokens, index);
    value = operator === '+' ? value + right : value - right;
  }

  return value;
}

export function evaluateMath(expression: string): string | null {
  const trimmed = expression.trim();
  if (!trimmed || !/^[\d+\-*/().\s]+$/.test(trimmed)) {
    return null;
  }

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) {
    return null;
  }

  try {
    const index = { current: 0 };
    const result = parseExpression(tokens, index);

    if (index.current !== tokens.length || !Number.isFinite(result)) {
      return null;
    }

    return Number.isInteger(result) ? String(result) : String(Math.round(result * 1e8) / 1e8);
  } catch {
    return null;
  }
}
