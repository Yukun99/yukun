import {
  fileUrl,
  isValidLink,
  LINK_PREFIX,
  MAX_LINK,
  parseModels,
} from '@/pages/3d/utils/models';

const model = { id: 1, name: 'Benchy', link: '', size: 10, createdAt: 5 };

describe('parseModels', () => {
  it('should accept a valid body', () => {
    expect(parseModels({ models: [model, { ...model, id: 2 }] })).toEqual([
      model,
      { ...model, id: 2 },
    ]);
  });

  it('should accept an empty list', () => {
    expect(parseModels({ models: [] })).toEqual([]);
  });

  it.each([
    ['null', null],
    ['no models key', {}],
    ['models not an array', { models: 'x' }],
    ['model not an object', { models: [1] }],
    ['model with a string id', { models: [{ ...model, id: '1' }] }],
    ['model without a name', { models: [{ ...model, name: undefined }] }],
  ])('should reject %s', (_label, body) => {
    expect(parseModels(body)).toBeNull();
  });
});

describe('isValidLink', () => {
  it('should accept an empty link', () => {
    expect(isValidLink('')).toBe(true);
  });

  it('should accept a MakerWorld link', () => {
    expect(isValidLink(`${LINK_PREFIX}en/models/1`)).toBe(true);
  });

  it('should reject another host', () => {
    expect(isValidLink('https://example.com/x')).toBe(false);
  });

  it('should reject whitespace', () => {
    expect(isValidLink(`${LINK_PREFIX}a b`)).toBe(false);
  });

  it('should reject a control character', () => {
    expect(isValidLink(`${LINK_PREFIX}a\u0007b`)).toBe(false);
  });

  it('should reject a link that is too long', () => {
    expect(isValidLink(LINK_PREFIX + 'a'.repeat(MAX_LINK))).toBe(false);
  });
});

describe('fileUrl', () => {
  it('should point at the model file', () => {
    expect(fileUrl(7)).toBe('/api/models/7/file');
  });
});
