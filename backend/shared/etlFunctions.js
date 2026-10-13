// Shared by the property controls and the browser/server execution engine.
export const sqlFunctions = [
  { value: 'upper', label: 'UPPER', args: [] },
  { value: 'lower', label: 'LOWER', args: [] },
  { value: 'trim', label: 'TRIM', args: [] },
  { value: 'length', label: 'LENGTH', args: [] },
  { value: 'concat', label: 'CONCAT', args: ['operand'] },
  { value: 'coalesce', label: 'COALESCE', args: ['operand'] },
  { value: 'nullif', label: 'NULLIF', args: ['operand'] },
  { value: 'replace', label: 'REPLACE', args: ['search', 'replacement'] },
  { value: 'substring', label: 'SUBSTRING', args: ['start', 'length'] },
];
export const mathFunctions = [
  { value: 'add', label: 'Add (+)', args: ['operand'] },
  { value: 'subtract', label: 'Subtract (−)', args: ['operand'] },
  { value: 'multiply', label: 'Multiply (×)', args: ['operand'] },
  { value: 'divide', label: 'Divide (÷)', args: ['operand'] },
  { value: 'modulo', label: 'Modulo (%)', args: ['operand'] },
  { value: 'power', label: 'Power', args: ['operand'] },
  { value: 'abs', label: 'ABS', args: [] },
  { value: 'round', label: 'ROUND', args: ['precision'] },
  { value: 'floor', label: 'FLOOR', args: [] },
  { value: 'ceil', label: 'CEIL', args: [] },
  { value: 'sqrt', label: 'SQRT', args: [] },
];

export const getFunctionDefinition = data => (data.type === 'math' ? mathFunctions : sqlFunctions)
  .find(fn => fn.value === (data.functionName || (data.type === 'math' ? 'add' : 'upper')));
const numeric = (value, label) => {
  if (value == null || typeof value === 'boolean' || typeof value === 'object' || String(value).trim() === '' || !Number.isFinite(Number(value))) throw new Error(`${label} must be a finite number.`);
  return Number(value);
};
const integer = (value, label, min, max) => {
  const n = numeric(value, label);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${label} must be an integer from ${min} to ${max}.`);
  return n;
};

export function applyRowFunction(rows, data) {
  const definition = getFunctionDefinition(data);
  if (!definition) throw new Error('Unknown SQL/math function.');
  if (!data.functionColumn || !data.resultColumn?.trim()) throw new Error('Configure input and result columns.');
  const hasOperand = definition.args.includes('operand');
  if (hasOperand && !['constant', 'column'].includes(data.operandMode || 'constant')) throw new Error('Choose a constant or column operand.');
  const check = column => {
    if (!column) throw new Error('Configure operand column.');
    if (rows.length && !rows.some(row => Object.hasOwn(row, column))) throw new Error(`Column "${column}" does not exist.`);
  };
  check(data.functionColumn);
  if (hasOperand && data.operandMode === 'column') check(data.operandColumn);
  const fn = definition.value;
  let precision, start, length;
  if (fn === 'round') precision = integer(data.precision ?? 0, 'Decimal places', 0, 10);
  if (fn === 'substring') {
    start = integer(data.substringStart ?? 1, 'Substring start', 1, Number.MAX_SAFE_INTEGER);
    length = data.substringLength == null || data.substringLength === '' ? undefined : integer(data.substringLength, 'Substring length', 0, Number.MAX_SAFE_INTEGER);
  }
  if (fn === 'replace' && !String(data.searchText ?? '').length) throw new Error('REPLACE needs nonempty search text.');
  if (hasOperand && data.operandMode !== 'column' && data.type === 'math') {
    const value = numeric(data.operandValue, 'Operand');
    if (['divide', 'modulo'].includes(fn) && value === 0) throw new Error('Cannot divide or take modulo by zero.');
  }
  return rows.map((row, index) => {
    try {
      const value = row[data.functionColumn];
      const operand = data.operandMode === 'column' ? row[data.operandColumn] : data.operandValue ?? '';
      let result;
      if (data.type === 'math') {
        // NULL propagates as in SQL. Empty CSV cells are invalid numeric values.
        if (value == null || (hasOperand && operand == null)) result = null;
        else {
          const a = numeric(value, 'Input'), b = hasOperand ? numeric(operand, 'Operand') : undefined;
          if (['divide', 'modulo'].includes(fn) && b === 0) throw new Error('Cannot divide or take modulo by zero.');
          if (fn === 'sqrt' && a < 0) throw new Error('SQRT needs a nonnegative number.');
          switch (fn) {
            case 'add': result = a + b; break;
            case 'subtract': result = a - b; break;
            case 'multiply': result = a * b; break;
            case 'divide': result = a / b; break;
            case 'modulo': result = a % b; break;
            case 'power': result = a ** b; break;
            case 'abs': result = Math.abs(a); break;
            case 'round': result = Number(a.toFixed(precision)); break;
            case 'floor': result = Math.floor(a); break;
            case 'ceil': result = Math.ceil(a); break;
            case 'sqrt': result = Math.sqrt(a); break;
          }
          if (!Number.isFinite(result)) throw new Error('Math result is not finite.');
        }
      } else {
        const text = value == null ? null : String(value);
        switch (fn) {
          case 'upper': result = text?.toUpperCase() ?? null; break;
          case 'lower': result = text?.toLowerCase() ?? null; break;
          case 'trim': result = text?.trim() ?? null; break;
          case 'length': result = text == null ? null : [...text].length; break;
          case 'concat': result = `${text ?? ''}${operand ?? ''}`; break;
          case 'coalesce': result = value ?? operand; break;
          case 'nullif': result = value != null && operand != null && String(value) === String(operand) ? null : value ?? null; break;
          case 'replace': result = text == null ? null : text.split(String(data.searchText)).join(String(data.replacementText ?? '')); break;
          case 'substring': result = text == null ? null : [...text].slice(start - 1, length === undefined ? undefined : start - 1 + length).join(''); break;
        }
      }
      return { ...row, [data.resultColumn.trim()]: result };
    } catch (error) { throw new Error(`Row ${index + 1}: ${error.message}`); }
  });
}
