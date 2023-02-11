import { Exclude } from 'class-transformer';
import { Users } from 'src/auth/auth.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  Status: TaskStatus;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => Users, (Users) => Users.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: Users;
}
