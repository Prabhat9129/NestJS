import { TaskStatus } from '../tasks.model';

export class filterDto {
  status: TaskStatus;
  search: string;
}
