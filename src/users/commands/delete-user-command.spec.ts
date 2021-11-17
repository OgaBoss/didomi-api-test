import { DeleteUserCommand } from './DeleteUserCommand';

describe('DeleteUserCommand', () => {
  it('should create an instance DeleteUserCommand', () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';

    const command = new DeleteUserCommand(user_id);
    expect(command.user_id).toBe(user_id);
  });
});
