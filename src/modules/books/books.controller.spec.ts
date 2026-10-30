import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';

describe('BooksController', () => {
  let app: INestApplication;

  const serviceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const validBook = {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441013593',
    price: 12.5,
    categoryId: '11111111-1111-4111-8111-111111111111',
  };

  const validUuid = '11111111-1111-4111-8111-111111111111';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: serviceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('validation', () => {
    it('POST /books thiếu title -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, title: undefined })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books title rỗng -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, title: '' })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books price âm -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, price: -1 })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books price có 3 chữ số thập phân -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, price: 1.234 })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books isbn sai định dạng -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, isbn: 'abc' })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books categoryId không phải uuid -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, categoryId: 'c1' })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books publishedAt sai định dạng -> 400', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, publishedAt: 'khong-phai-ngay' })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('POST /books gửi field lạ -> 400 (forbidNonWhitelisted)', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, hacked: 'x' })
        .expect(400);

      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('GET /books?page=abc -> 400', async () => {
      await request(app.getHttpServer()).get('/books?page=abc').expect(400);

      expect(serviceMock.findAll).not.toHaveBeenCalled();
    });

    it('GET /books?limit=101 -> 400', async () => {
      await request(app.getHttpServer()).get('/books?limit=101').expect(400);

      expect(serviceMock.findAll).not.toHaveBeenCalled();
    });

    it('GET /books?categoryId=khong-phai-uuid -> 400', async () => {
      await request(app.getHttpServer())
        .get('/books?categoryId=c1')
        .expect(400);

      expect(serviceMock.findAll).not.toHaveBeenCalled();
    });

    it('GET /books/:id không phải uuid -> 400', async () => {
      await request(app.getHttpServer()).get('/books/123').expect(400);

      expect(serviceMock.findOne).not.toHaveBeenCalled();
    });

    it('DELETE /books/:id không phải uuid -> 400', async () => {
      await request(app.getHttpServer()).delete('/books/123').expect(400);

      expect(serviceMock.remove).not.toHaveBeenCalled();
    });

    it('PATCH /books/:id body rỗng vẫn hợp lệ (PartialType)', async () => {
      serviceMock.update.mockResolvedValue({ id: validUuid });

      await request(app.getHttpServer())
        .patch(`/books/${validUuid}`)
        .send({})
        .expect(200);

      expect(serviceMock.update).toHaveBeenCalledWith(validUuid, {});
    });
  });

  describe('happy path', () => {
    it('POST /books 201 và truyền DTO đã transform xuống service', async () => {
      const created = { id: validUuid, ...validBook };
      serviceMock.create.mockResolvedValue(created);

      const res = await request(app.getHttpServer())
        .post('/books')
        .send({ ...validBook, publishedAt: '2020-01-02' })
        .expect(201);

      expect(res.body).toEqual(created);
      expect(serviceMock.create).toHaveBeenCalledWith({
        ...validBook,
        publishedAt: '2020-01-02',
      });
    });

    it('GET /books 200, query được transform sang number', async () => {
      const payload = {
        items: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
      };
      serviceMock.findAll.mockResolvedValue(payload);

      const res = await request(app.getHttpServer())
        .get('/books?page=2&limit=5&search=dune')
        .expect(200);

      expect(res.body).toEqual(payload);
      expect(serviceMock.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        search: 'dune',
      });
    });

    it('GET /books/:id 200', async () => {
      const book = { id: validUuid, ...validBook };
      serviceMock.findOne.mockResolvedValue(book);

      const res = await request(app.getHttpServer())
        .get(`/books/${validUuid}`)
        .expect(200);

      expect(res.body).toEqual(book);
      expect(serviceMock.findOne).toHaveBeenCalledWith(validUuid);
    });

    it('PATCH /books/:id 200', async () => {
      const updated = { id: validUuid, ...validBook, title: 'Dune 2' };
      serviceMock.update.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .patch(`/books/${validUuid}`)
        .send({ title: 'Dune 2' })
        .expect(200);

      expect(res.body).toEqual(updated);
      expect(serviceMock.update).toHaveBeenCalledWith(validUuid, {
        title: 'Dune 2',
      });
    });

    it('DELETE /books/:id trả 204 không có body', async () => {
      serviceMock.remove.mockResolvedValue(undefined);

      const res = await request(app.getHttpServer())
        .delete(`/books/${validUuid}`)
        .expect(204);

      expect(res.body).toEqual({});
      expect(serviceMock.remove).toHaveBeenCalledWith(validUuid);
    });
  });
});
