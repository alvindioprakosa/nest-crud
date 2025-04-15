import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

// Mock implementation
const mockTaskRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tasks', async () => {
    const mockTasks = [{ id: 1, text: 'Test', day: 'Today', reminder: false }];
    repository.find.mockResolvedValue(mockTasks as any);
    
    const result = await service.findAll();
    expect(result).toEqual(mockTasks);
    expect(repository.find).toHaveBeenCalled();
  });
});
