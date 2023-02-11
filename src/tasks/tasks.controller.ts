import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { filterDto } from './dto/filterDto.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  logger = new Logger();
  constructor(private tasksService: TasksService) {}

  @Get()
  getTask(
    @Query() FilterDto: filterDto,
    @GetUser() user: Users,
  ): Promise<Task[]> {
    return this.tasksService.getTask(FilterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: Users): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  postTasks(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: Users,
  ): Promise<Task> {
    this.logger.log(
      `creating a new task :with user:${user.username} & data ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: Users) {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: Users,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, status, user);
  }
  // @Get()
  // getTasks(@Query() FilterDto: filterDto): Task[] {
  //   if (Object.keys(FilterDto).length) {
  //     return this.tasksService.filetask(FilterDto);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Delete('/:id')
  // deleteTaskById(@Param('id') id: string): Task {
  //   this.tasksService.deleteById(id);
  //   return this.tasksService.getTaskById(id);
  // }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body('status') status: TaskStatus,
  // ): Task {
  //   return this.tasksService.updateStatus(id, status);
  // }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto);
  // }
}
