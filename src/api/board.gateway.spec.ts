import { Test, TestingModule } from '@nestjs/testing';
import { BoardGateway } from './board.gateway';

describe('BoardGateway', () => {
  let gateway: BoardGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardGateway],
    }).compile();

    gateway = module.get<BoardGateway>(BoardGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
