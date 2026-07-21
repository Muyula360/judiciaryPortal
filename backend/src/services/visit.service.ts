import { prisma } from '../config/database';

export class VisitService {
  // Track a new visit
  async trackVisit(data: {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    page?: string;
    referer?: string;
  }) {
    const existing = await prisma.visit.findUnique({
      where: { sessionId: data.sessionId },
    });

    let visit;
    if (existing) {
      visit = await prisma.visit.update({
        where: { sessionId: data.sessionId },
        data: {
          ipAddress: data.ipAddress || existing.ipAddress,
          userAgent: data.userAgent || existing.userAgent,
          page: data.page || existing.page,
          referer: data.referer || existing.referer,
          visitedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      visit = await prisma.visit.create({
        data: {
          sessionId: data.sessionId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          page: data.page,
          referer: data.referer,
          visitedAt: new Date(),
        },
      });
    }

    await this.updateStats();
    return visit;
  }

  // Update statistics
  async updateStats() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [daily, weekly, monthly, yearly, total] = await Promise.all([
      prisma.visit.count({ where: { visitedAt: { gte: startOfDay } } }),
      prisma.visit.count({ where: { visitedAt: { gte: startOfWeek } } }),
      prisma.visit.count({ where: { visitedAt: { gte: startOfMonth } } }),
      prisma.visit.count({ where: { visitedAt: { gte: startOfYear } } }),
      prisma.visit.count(),
    ]);

    return await prisma.visitStats.upsert({
      where: { date: startOfDay },
      update: {
        daily,
        weekly,
        monthly,
        yearly,
        total,
        updatedAt: new Date(),
      },
      create: {
        date: startOfDay,
        daily,
        weekly,
        monthly,
        yearly,
        total,
      },
    });
  }

  // Get statistics
  async getStats() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    let stats = await prisma.visitStats.findUnique({
      where: { date: startOfDay },
    });

    if (!stats) {
      await this.updateStats();
      stats = await prisma.visitStats.findUnique({
        where: { date: startOfDay },
      });
    }

    return stats;
  }
}