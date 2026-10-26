import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BooksRepository } from './book.repository.js';

describe('BooksService', () => {
  let service: BooksService;

  const repoMock = {
    findByIsbn: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const dto = {
    title: 'Dune',
    author: 'Herbert',
    isbn: '9780441013593',
    price: 12.5,
    categoryId: '11111111-1111-4111-8111-111111111111',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BooksRepository, useValue: repoMock },
      ],
    }).compile();
    service = module.get(BooksService);
  });

  describe('create', () => {
    it('throw ConflictException khi ISBN đã tồn tại', async () => {
      repoMock.findByIsbn.mockResolvedValue({ id: 'old' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('convert publishedAt string sang Date', async () => {
      repoMock.findByIsbn.mockResolvedValue(null);
      repoMock.create.mockResolvedValue({ id: 'b1' });

      await service.create({ ...dto, publishedAt: '2020-01-02' });

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ publishedAt: new Date('2020-01-02') }),
      );
    });

    it('publishedAt undefined -> null', async () => {
      repoMock.findByIsbn.mockResolvedValue(null);
      repoMock.create.mockResolvedValue({ id: 'b1' });

      await service.create(dto);

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ publishedAt: null }),
      );
    });
  });

  describe('findOne', () => {
    it('throw NotFoundException khi không có', async () => {
      repoMock.findById.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('trả sách khi có', async () => {
      repoMock.findById.mockResolvedValue({ id: 'b1' });
      await expect(service.findOne('b1')).resolves.toEqual({ id: 'b1' });
    });
  });

  describe('findAll', () => {
    it('default page=1 limit=10, tính skip đúng', async () => {
      repoMock.findMany.mockResolvedValue({ items: [], total: 0 });

      const res = await service.findAll({});

      expect(repoMock.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        search: undefined,
        categoryId: undefined,
      });
      expect(res).toEqual({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });

    it('page=3 limit=5 -> skip=10, totalPages đúng', async () => {
      repoMock.findMany.mockResolvedValue({ items: [], total: 12 });

      const res = await service.findAll({ page: 3, limit: 5 });

      expect(repoMock.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
      expect(res.totalPages).toBe(3);
    });
  });

  describe('update', () => {
    it('throw NotFoundException khi sách không tồn tại', async () => {
      repoMock.findById.mockResolvedValue(null);
      await expect(service.update('missing', { title: 'x' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repoMock.update).not.toHaveBeenCalled();
    });

    it('categoryId được map sang connect', async () => {
      repoMock.findById.mockResolvedValue({ id: 'b1' });
      repoMock.update.mockResolvedValue({ id: 'b1' });

      await service.update('b1', { categoryId: 'c2' });

      expect(repoMock.update).toHaveBeenCalledWith('b1', {
        category: { connect: { id: 'c2' } },
      });
    });

    it('không gửi categoryId thì không connect', async () => {
      repoMock.findById.mockResolvedValue({ id: 'b1' });
      repoMock.update.mockResolvedValue({ id: 'b1' });

      await service.update('b1', { title: 'New' });

      const payload = repoMock.update.mock.calls[0][1];
      expect(payload.category).toBeUndefined();
      expect(payload.title).toBe('New');
    });
  });

  describe('remove', () => {
    it('throw NotFoundException khi không tồn tại', async () => {
      repoMock.findById.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
      expect(repoMock.delete).not.toHaveBeenCalled();
    });

    it('xoá khi tồn tại', async () => {
      repoMock.findById.mockResolvedValue({ id: 'b1' });
      repoMock.delete.mockResolvedValue({ id: 'b1' });

      await service.remove('b1');

      expect(repoMock.delete).toHaveBeenCalledWith('b1');
    });
  });
});
