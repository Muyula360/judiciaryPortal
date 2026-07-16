// src/services/caseDetail.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class CaseDetailService {
  async findAll(options?: {
    search?: string;
    court?: string;
    caseStatus?: string;
    courtLevel?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    page?: number;
    excludeDecided?: boolean;
  }) {
    const where: Prisma.CaseDetailWhereInput = {};
    const { 
      search, 
      court, 
      caseStatus, 
      courtLevel, 
      fromDate, 
      toDate, 
      limit = 10,
      page = 1,
      excludeDecided = true,
    } = options || {};

    // 🔍 Search filter (case reference, number, parties, judge, court)
    if (search) {
      where.OR = [
        { caseReference: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { caseParties: { contains: search, mode: 'insensitive' } },
        { judge: { contains: search, mode: 'insensitive' } },
        { court: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 🏛️ Court filter
    if (court) {
      where.court = { contains: court, mode: 'insensitive' };
    }

    // 📊 Case status filter - EXCLUDE DECIDED CASES
    if (excludeDecided) {
      where.caseStatus = {
        not: {
          equals: 'decided',
        },
      };
    }

    // If caseStatus is explicitly provided, override excludeDecided
    if (caseStatus) {
      where.caseStatus = { contains: caseStatus, mode: 'insensitive' };
    }

    // 🏢 Court level filter
    if (courtLevel) {
      where.courtLevel = { contains: courtLevel, mode: 'insensitive' };
    }

    // 📅 Date range filter (using nextStageDate)
    if (fromDate || toDate) {
      where.nextStageDate = {};
      if (fromDate) {
        where.nextStageDate.gte = new Date(fromDate);
      }
      if (toDate) {
        where.nextStageDate.lte = new Date(toDate);
      }
    }

    // 📄 Pagination
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const validPage = Math.max(1, Number(page) || 1);
    const skip = (validPage - 1) * validLimit;

    // 🚀 Execute queries
    const [cases, total] = await Promise.all([
      prisma.caseDetail.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: { nextStageDate: 'asc' },
      }),
      prisma.caseDetail.count({ where }),
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

  // ============= FIND CASES BY COURT AND DATE RANGE =============
  async findByCourtAndDateRange(
    court: string, 
    fromDate: string, 
    toDate: string,
    excludeDecided: boolean = true
  ) {
    console.log('🔍 Finding cases for court:', court, 'from:', fromDate, 'to:', toDate);
    
    const where: Prisma.CaseDetailWhereInput = {
      court: {
        equals: court,
      },
      nextStageDate: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    };

    // EXCLUDE DECIDED CASES
    if (excludeDecided) {
      where.caseStatus = {
        not: {
          equals: 'decided',
        },
      };
    }

    const cases = await prisma.caseDetail.findMany({
      where,
      orderBy: {
        nextStageDate: 'asc',
      },
    });

    console.log(`📊 Found ${cases.length} cases`);
    return cases;
  }

  // ============= GET DISTINCT COURTS =============
  async getDistinctCourts() {
    const courts = await prisma.caseDetail.findMany({
      select: {
        court: true,
      },
      where: {
        // Only get courts with non-decided cases
        caseStatus: {
          not: {
            equals: 'decided',
          },
        },
      },
      distinct: ['court'],
      orderBy: {
        court: 'asc',
      },
    });

    return courts
      .map(item => item.court)
      .filter(court => court && court.trim() !== '');
  }

  // ============= GET COURTS WITH CASE COUNTS =============
  async getCourtsWithCounts() {
    const courts = await prisma.caseDetail.groupBy({
      by: ['court'],
      where: {
        // Only count non-decided cases
        caseStatus: {
          not: {
            equals: 'decided',
          },
        },
      },
      _count: {
        court: true,
      },
      orderBy: {
        court: 'asc',
      },
    });

    return courts
      .map(item => ({
        court: item.court,
        count: item._count.court,
      }))
      .filter(item => item.court && item.court.trim() !== '');
  }

  // ============= GET FILTERED COURTS =============
  async getFilteredCourts(options?: {
    search?: string;
    caseStatus?: string;
    courtLevel?: string;
    fromDate?: string;
    toDate?: string;
    excludeDecided?: boolean;
  }) {
    const where: Prisma.CaseDetailWhereInput = {};

    if (options?.search) {
      where.OR = [
        { caseReference: { contains: options.search, mode: 'insensitive' } },
        { caseNumber: { contains: options.search, mode: 'insensitive' } },
        { caseParties: { contains: options.search, mode: 'insensitive' } },
        { judge: { contains: options.search, mode: 'insensitive' } },
        { court: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    // EXCLUDE DECIDED CASES
    const excludeDecided = options?.excludeDecided !== undefined ? options.excludeDecided : true;
    if (excludeDecided && !options?.caseStatus) {
      where.caseStatus = {
        not: {
          equals: 'decided',
        },
      };
    }

    // If caseStatus is explicitly provided, override excludeDecided
    if (options?.caseStatus) {
      where.caseStatus = { contains: options.caseStatus, mode: 'insensitive' };
    }

    if (options?.courtLevel) {
      where.courtLevel = { contains: options.courtLevel, mode: 'insensitive' };
    }

    if (options?.fromDate || options?.toDate) {
      where.nextStageDate = {};
      if (options?.fromDate) {
        where.nextStageDate.gte = new Date(options.fromDate);
      }
      if (options?.toDate) {
        where.nextStageDate.lte = new Date(options.toDate);
      }
    }

    const courts = await prisma.caseDetail.findMany({
      where,
      select: {
        court: true,
      },
      distinct: ['court'],
      orderBy: {
        court: 'asc',
      },
    });

    return courts
      .map(item => item.court)
      .filter(court => court && court.trim() !== '');
  }

  // ============= GET CASES BY DATE RANGE =============
  async getCasesByDateRange(
    startDate: string, 
    endDate: string, 
    excludeDecided: boolean = true
  ) {
    const where: Prisma.CaseDetailWhereInput = {
      nextStageDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    // EXCLUDE DECIDED CASES
    if (excludeDecided) {
      where.caseStatus = {
        not: {
          equals: 'decided',
        },
      };
    }

    return await prisma.caseDetail.findMany({
      where,
      orderBy: { nextStageDate: 'asc' },
    });
  }
}