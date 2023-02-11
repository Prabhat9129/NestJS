import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.model';
import { filterDto } from './dto/filterDto.dto';
import { Users } from 'src/auth/auth.entity';

@Injectable()
export class TasksService {
  constructor(private readonly userRepository: TasksRepository) {}

  async getTask(FilterDto: filterDto, user: Users): Promise<Task[]> {
    return this.userRepository.findTask(FilterDto, user);
  }

  async getById(id: string, user: Users): Promise<Task> {
    const found = this.userRepository.getById(id, user);
    if (!found) {
      throw new NotFoundException(`Task with ${id} ot found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
    return this.userRepository.addTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: Users) {
    return this.userRepository.deleteTask(id, user);
  }

  async updateTask(id: string, status: TaskStatus, user: Users): Promise<Task> {
    return this.userRepository.updateTask(id, status, user);
  }
}
