import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';

export class UpdateUserConsentsEvents {
  constructor(
    public readonly user_id: string,
    public readonly version: number,
    public readonly consents: ConsentsDataInterface[],
  ) {}
}
