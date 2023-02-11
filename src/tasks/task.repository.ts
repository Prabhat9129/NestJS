import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Users } from 'src/auth/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { filterDto } from './dto/filterDto.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findTask(FilterDto: filterDto, user: Users): Promise<Task[]> {
    const { status, search } = FilterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('LOWER(task.Status) = LOWER(:status)', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }
    try {
      const Task = await query.getMany();
      return Task;
    } catch (error) {
      this.logger.error(
        `failed to get tasks for user ${
          user.username
        } , filter :${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getById(id: string, user: Users) {
    // const query = this.createQueryBuilder('task');
    // query.where({ user });
    return this.findOne({ where: { id, user } });
  }

  async addTask(CreateTaskDto: CreateTaskDto, user: Users) {
    const { title, description } = CreateTaskDto;
    const task = this.create({
      title,
      description,
      Status: TaskStatus.OPEN,
      user,
    });
    return await this.save(task);
  }

  async deleteTask(id: string, user: Users) {
    return await this.delete({ id, user });
  }

  async updateTask(id: string, status: TaskStatus, user: Users): Promise<Task> {
    const task = await this.getById(id, user);
    task.Status = status;
    this.save(task);
    return task;
  }
}
