// src/services/primaryCourt.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class PrimaryCourtService {
  async findAll(options?: {
    search?: string;
    mahakama?: string;
    status?: string;
    ainaYaShauri?: string;
    kanda?: string;
    wilaya?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    page?: number;
  }) {
    const where: Prisma.primary_courtsWhereInput = {};
    const { 
      search, 
      mahakama, 
      status, 
      ainaYaShauri, 
      kanda, 
      wilaya,
      fromDate, 
      toDate, 
      limit = 10,
      page = 1
    } = options || {};

    // Search filter
    if (search) {
      where.OR = [
        { namba_ya_shauri_ya_marejeo: { contains: search, mode: 'insensitive' } },
        { namba_ya_shauri: { contains: search, mode: 'insensitive' } },
        { wadaawa: { contains: search, mode: 'insensitive' } },
        { hakimu: { contains: search, mode: 'insensitive' } },
        { mahakama: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Court filter
    if (mahakama) {
      where.mahakama = { contains: mahakama, mode: 'insensitive' };
    }

    // Status filter
    if (status) {
      where.status = { contains: status, mode: 'insensitive' };
    }

    // Case type filter
    if (ainaYaShauri) {
      where.aina_ya_shauri = { contains: ainaYaShauri, mode: 'insensitive' };
    }

    // Region filter
    if (kanda) {
      where.kanda = { contains: kanda, mode: 'insensitive' };
    }

    // District filter
    if (wilaya) {
      where.wilaya = { contains: wilaya, mode: 'insensitive' };
    }

    // Date range filter
    if (fromDate || toDate) {
      where.tarehe_ya_kufungua_shauri = {};
      if (fromDate) {
        where.tarehe_ya_kufungua_shauri.gte = new Date(fromDate);
      }
      if (toDate) {
        where.tarehe_ya_kufungua_shauri.lte = new Date(toDate);
      }
    }

    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const validPage = Math.max(1, Number(page) || 1);
    const skip = (validPage - 1) * validLimit;

    const [cases, total] = await Promise.all([
      prisma.primary_courts.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
      }),
      prisma.primary_courts.count({ where }),
    ]);

    return {
      data: cases,
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async findById(id: number) {
    const courtCase = await prisma.primary_courts.findUnique({
      where: { id },
    });
    if (!courtCase) throw new Error('Case not found');
    return courtCase;
  }

  async findByReference(nambaYaShauriYaMarejeo: string) {
    const courtCase = await prisma.primary_courts.findFirst({
      where: { namba_ya_shauri_ya_marejeo: nambaYaShauriYaMarejeo },
    });
    if (!courtCase) throw new Error('Case not found');
    return courtCase;
  }

  async findByCaseNumber(nambaYaShauri: string) {
    const courtCase = await prisma.primary_courts.findFirst({
      where: { namba_ya_shauri: nambaYaShauri },
    });
    if (!courtCase) throw new Error('Case not found');
    return courtCase;
  }

  async findByCourt(mahakama: string) {
    return await prisma.primary_courts.findMany({
      where: { mahakama: { contains: mahakama, mode: 'insensitive' } },
      orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
    });
  }

  async findByJudge(hakimu: string) {
    return await prisma.primary_courts.findMany({
      where: { hakimu: { contains: hakimu, mode: 'insensitive' } },
      orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
    });
  }

  async getDistinctCourts() {
    const courts = await prisma.primary_courts.findMany({
      select: {
        mahakama: true,
      },
      distinct: ['mahakama'],
      orderBy: {
        mahakama: 'asc',
      },
    });

    return courts
      .map((item) => item.mahakama)
      .filter((court): court is string => court !== null && court.trim() !== '');
  }

  async getStats() {
    const [total, byStatus, byCaseType, backlog] = await Promise.all([
      prisma.primary_courts.count(),
      prisma.primary_courts.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.primary_courts.groupBy({
        by: ['aina_ya_shauri'],
        _count: true,
      }),
      prisma.primary_courts.groupBy({
        by: ['backlog_status'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      byCaseType: byCaseType.map((item) => ({
        type: item.aina_ya_shauri,
        count: item._count,
      })),
      backlog: backlog.map((item) => ({
        status: item.backlog_status,
        count: item._count,
      })),
    };
  }

  async getByDateRange(fromDate: string, toDate: string) {
    return await prisma.primary_courts.findMany({
      where: {
        tarehe_ya_kufungua_shauri: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
    });
  }

  async getByStatus(status: string) {
    return await prisma.primary_courts.findMany({
      where: { status: { contains: status, mode: 'insensitive' } },
      orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
    });
  }

  async getBacklogCases() {
    return await prisma.primary_courts.findMany({
      where: { backlog_status: { contains: 'Yes', mode: 'insensitive' } },
      orderBy: { tarehe_ya_kufungua_shauri: 'desc' },
    });
  }
}