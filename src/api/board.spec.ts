import { Test, TestingModule } from '@nestjs/testing';
import { Board } from './board';

describe('Board', () => {
  let provider: Board;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Board],
    }).compile();

    provider = module.get<Board>(Board);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
