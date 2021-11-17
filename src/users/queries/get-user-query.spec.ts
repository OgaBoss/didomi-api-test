import { GetUserQuery } from './GetUserQuery';

describe('GetUserQuery', () => {
  it('should create an instance of GetUserQuery', () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';
    const query = new GetUserQuery(user_id);

    expect(query.user_id).toBe(user_id);
  });
});
