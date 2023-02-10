import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { filterDto } from './dto/filterDto.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findTask(FilterDto: filterDto): Promise<Task[]> {
    const { status, search } = FilterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('LOWER(task.Status) = LOWER(:status)', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const Task = await query.getMany();
    return Task;
  }

  async getById(id: string) {
    return this.findOne({ where: { id } });
  }

  async addTask(CreateTaskDto: CreateTaskDto) {
    const { title, description } = CreateTaskDto;
    const task = this.create({
      title,
      description,
      Status: TaskStatus.OPEN,
    });
    return await this.save(task);
  }

  async deleteTask(id: string) {
    return await this.delete(id);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getById(id);
    task.Status = status;
    this.save(task);
    return task;
  }
}
