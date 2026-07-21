// src/services/category.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { generateSlug, ensureUniqueCategorySlug } from '../utils/slugfy';

export class CategoryService {
  async findAll() {
    return await prisma.category.findMany({
      include: {
        icon: true,
        links: {
          include: {
            icon: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        icon: true,
        links: {
          include: {
            icon: true,
          },
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        icon: true,
        links: {
          include: {
            icon: true,
          },
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async create(data: {
    name: string;
    iconName: string;
    colorHex: string;
  }) {
    // Verify that the icon exists
    const icon = await prisma.icon.findUnique({
      where: { name: data.iconName },
    });
    if (!icon) {
      throw new Error(`Icon "${data.iconName}" not found. Please create it first.`);
    }

    const slug = await ensureUniqueCategorySlug(generateSlug(data.name));

    return await prisma.category.create({
      data: {
        name: data.name,
        slug,
        iconName: data.iconName,
        colorHex: data.colorHex,
      },
      include: {
        icon: true,
      },
    });
  }

  async update(id: number, data: {
    name?: string;
    iconName?: string;
    colorHex?: string;
  }) {
    const existing = await prisma.category.findUnique({
      where: { id },
    });
    if (!existing) throw new Error('Category not found');

    if (data.iconName) {
      const icon = await prisma.icon.findUnique({
        where: { name: data.iconName },
      });
      if (!icon) {
        throw new Error(`Icon "${data.iconName}" not found.`);
      }
    }

    let slug = existing.slug;
    if (data.name) {
      slug = await ensureUniqueCategorySlug(generateSlug(data.name));
    }

    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        iconName: data.iconName,
        colorHex: data.colorHex,
      },
      include: {
        icon: true,
      },
    });
  }

  async updateBySlug(slug: string, data: {
    name?: string;
    iconName?: string;
    colorHex?: string;
  }) {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (!existing) throw new Error('Category not found');

    if (data.iconName) {
      const icon = await prisma.icon.findUnique({
        where: { name: data.iconName },
      });
      if (!icon) {
        throw new Error(`Icon "${data.iconName}" not found.`);
      }
    }

    let newSlug = slug;
    if (data.name) {
      newSlug = await ensureUniqueCategorySlug(generateSlug(data.name));
    }

    return await prisma.category.update({
      where: { slug },
      data: {
        name: data.name,
        slug: newSlug,
        iconName: data.iconName,
        colorHex: data.colorHex,
      },
      include: {
        icon: true,
      },
    });
  }

  async delete(id: number) {
    try {
      return await prisma.category.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Category not found');
      throw error;
    }
  }

  async deleteBySlug(slug: string) {
    try {
      return await prisma.category.delete({ where: { slug } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Category not found');
      throw error;
    }
  }

  async getLinksByCategorySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        links: {
          include: {
            icon: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category.links;
  }
}