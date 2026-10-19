import { toInclude, toPagination, toSearch } from './query';

describe('query helpers', () => {
  it('keeps only allowed includes', () => {
    expect(toInclude(['note', 'user'], ['note'])).toEqual({ note: true });
    expect(toInclude(['user'], ['note'])).toBeUndefined();
    expect(toInclude(undefined, ['note'])).toBeUndefined();
  });

  it('builds a case-insensitive OR search', () => {
    expect(toSearch(['title', 'description'], 'up')).toEqual({
      OR: [
        { title: { contains: 'up', mode: 'insensitive' } },
        { description: { contains: 'up', mode: 'insensitive' } },
      ],
    });
    expect(toSearch(['title'], undefined)).toEqual({});
  });

  it('paginates and falls back to the first sortable field', () => {
    expect(toPagination({ page: 3, limit: 5, sortBy: 'title', order: 'asc' }, ['createdAt', 'title'])).toEqual({
      skip: 10,
      take: 5,
      orderBy: { title: 'asc' },
    });
    expect(toPagination({ sortBy: 'password' }, ['createdAt'])).toEqual({
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });
});
