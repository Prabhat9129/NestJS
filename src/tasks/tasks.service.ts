import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.model';
import { filterDto } from './dto/filterDto.dto';

@Injectable()
export class TasksService {
  constructor(private readonly userRepository: TasksRepository) {}

  async getTask(FilterDto: filterDto): Promise<Task[]> {
    return this.userRepository.findTask(FilterDto);
  }

  async getById(id: string): Promise<Task> {
    const found = this.userRepository.getById(id);
    if (!found) {
      throw new NotFoundException(`Task with ${id} ot found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.userRepository.addTask(createTaskDto);
  }
  async deleteTask(id: string) {
    return this.userRepository.deleteTask(id);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    return this.userRepository.updateTask(id, status);
  }
}
