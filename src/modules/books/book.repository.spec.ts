import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { BooksRepository } from './book.repository.js';

describe('BooksRepository', () => {
  let repo: BooksRepository;
  const bookMock = {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const prismaMock = {
    book: bookMock,
    $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repo = module.get(BooksRepository);
  });

  describe('buildWhere (qua findMany)', () => {
    it('không filter gì khi params rỗng', async () => {
      bookMock.findMany.mockResolvedValue([]);
      bookMock.count.mockResolvedValue(0);

      await repo.findMany({ skip: 0, take: 10 });

      expect(bookMock.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
// 
    it('filter theo categoryId', async () => {
      bookMock.findMany.mockResolvedValue([]);
      bookMock.count.mockResolvedValue(0);

      await repo.findMany({ skip: 0, take: 10, categoryId: 'c1' });

      expect(bookMock.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { categoryId: 'c1' } }),
      );
    });
  });
});
