// src/services/link.service.ts
import { Prisma, Link, Permit, Status } from '@prisma/client';
import { prisma } from '../config/database';
import { validateIconExists } from './icon.service';
import { generateSlug, ensureUniqueLinkSlug } from '../utils/slugfy';

export class LinkService {
  async findAllByCategorySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        links: {
          include: {
            icon: true,
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category.links;
  }

  async findAllByPermit(permit: Permit) {
    return await prisma.link.findMany({
      where: { permit },
      include: {
        icon: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllInternal() {
    return await this.findAllByPermit('internal');
  }

  async findAllExternal() {
    return await this.findAllByPermit('external');
  }

  async create(data: {
    name: string;
    url: string;
    desc?: string;
    iconName: string;
    categoryId: number;
    status?: Status;
    permit?: Permit;
  }) {
    // Validate icon exists
    await validateIconExists(data.iconName);

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new Error('Category not found');

    // Generate unique slug
    const slug = await ensureUniqueLinkSlug(generateSlug(data.name));

    return await prisma.link.create({
      data: {
        name: data.name,
        url: data.url,
        desc: data.desc || '',
        iconName: data.iconName,
        categoryId: data.categoryId,
        status: data.status || 'online',
        permit: data.permit || 'external',
        slug,
      },
      include: {
        icon: true,
        category: true,
      },
    });
  }

  async createMany(dataArray: {
    name: string;
    url: string;
    desc?: string;
    iconName: string;
    categoryId: number;
    status?: Status;
    permit?: Permit;
  }[]) {
    // Validate all icons and categories
    for (const data of dataArray) {
      await validateIconExists(data.iconName);
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new Error(`Category with id ${data.categoryId} not found`);
    }

    // Generate slugs and prepare data
    const preparedData = await Promise.all(
      dataArray.map(async (data) => {
        const slug = await ensureUniqueLinkSlug(generateSlug(data.name));
        return {
          ...data,
          slug,
          desc: data.desc || '',
          status: data.status || 'online',
          permit: data.permit || 'external',
        };
      })
    );

    return await prisma.$transaction(
      preparedData.map((data) =>
        prisma.link.create({
          data,
          include: {
            icon: true,
            category: true,
          },
        })
      )
    );
  }

  async update(id: number, data: {
    name?: string;
    url?: string;
    desc?: string;
    iconName?: string;
    categoryId?: number;
    status?: Status;
    permit?: Permit;
  }) {
    try {
      const existing = await prisma.link.findUnique({
        where: { id },
      });
      if (!existing) throw new Error('Link not found');

      // Validate icon if being updated
      if (data.iconName) {
        await validateIconExists(data.iconName);
      }

      // Validate category if being updated
      if (data.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: data.categoryId },
        });
        if (!category) throw new Error('Category not found');
      }

      let slug = existing.slug;
      if (data.name) {
        slug = await ensureUniqueLinkSlug(generateSlug(data.name));
      }

      return await prisma.link.update({
        where: { id },
        data: {
          name: data.name,
          url: data.url,
          desc: data.desc,
          iconName: data.iconName,
          categoryId: data.categoryId,
          status: data.status,
          permit: data.permit,
          slug,
        },
        include: {
          icon: true,
          category: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Link not found');
      throw error;
    }
  }

  async updateBySlug(slug: string, data: {
    name?: string;
    url?: string;
    desc?: string;
    iconName?: string;
    categoryId?: number;
    status?: Status;
    permit?: Permit;
  }) {
    try {
      const existing = await prisma.link.findUnique({
        where: { slug },
      });
      if (!existing) throw new Error('Link not found');

      if (data.iconName) {
        await validateIconExists(data.iconName);
      }

      if (data.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: data.categoryId },
        });
        if (!category) throw new Error('Category not found');
      }

      let newSlug = slug;
      if (data.name) {
        newSlug = await ensureUniqueLinkSlug(generateSlug(data.name));
      }

      return await prisma.link.update({
        where: { slug },
        data: {
          name: data.name,
          url: data.url,
          desc: data.desc,
          iconName: data.iconName,
          categoryId: data.categoryId,
          status: data.status,
          permit: data.permit,
          slug: newSlug,
        },
        include: {
          icon: true,
          category: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Link not found');
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await prisma.link.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Link not found');
      throw error;
    }
  }

  async deleteBySlug(slug: string) {
    try {
      return await prisma.link.delete({ where: { slug } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Link not found');
      throw error;
    }
  }

  async findBySlug(slug: string) {
    const link = await prisma.link.findUnique({
      where: { slug },
      include: {
        icon: true,
        category: true,
      },
    });
    if (!link) throw new Error('Link not found');
    return link;
  }

  async findAll(options?: {
    categoryId?: number;
    permit?: Permit;
    search?: string;
  }) {
    const where: Prisma.LinkWhereInput = {};

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.permit) {
      where.permit = options.permit;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { desc: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.link.findMany({
      where,
      include: {
        icon: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}