escribe('deepMix', () => {
  it('should merge objects correctly', () => {
    const result = deepMix({}, { a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should deep merge nested objects', () => {
    const result = deepMix({}, { a: { x: 1 } }, { a: { y: 2 } });
    expect(result).toEqual({ a: { x: 1, y: 2 } });
  });

  it('should merge arrays by replacing', () => {
    const result = deepMix({}, { a: [1, 2] }, { a: [3, 4] });
    expect(result).toEqual({ a: [3, 4] });
  });

  it('should not pollute prototype via __proto__', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"polluted": "yes"}}');
    deepMix({}, maliciousPayload);
    expect(({} as any).polluted).toBeUndefined();
    delete (Object.prototype as any).polluted;
  });

  it('should not pollute prototype via nested __proto__', () => {
    const maliciousPayload = JSON.parse('{"a": {"__proto__": {"polluted": "yes"}}}');
    deepMix({}, maliciousPayload);
    expect(({} as any).polluted).toBeUndefined();
    delete (Object.prototype as any).polluted;
  });

  it('should not pollute prototype via constructor.prototype', () => {
    const maliciousPayload = JSON.parse('{"constructor": {"prototype": {"polluted": "yes"}}}');
    deepMix({}, maliciousPayload);
    expect(({} as any).polluted).toBeUndefined();
    delete (Object.prototype as any).polluted;
  });

  it('should still merge safe keys correctly after fix', () => {
    const result = deepMix({}, { safe: 'value', nested: { key: 'data' } });
    expect(result).toEqual({ safe: 'value', nested: { key: 'data' } });
  });
});
