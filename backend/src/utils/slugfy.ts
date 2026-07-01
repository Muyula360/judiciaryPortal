import slugify from 'slugify';
import { prisma } from '../config/database';

export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-',
  });
};

export const ensureUniqueCategorySlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const ensureUniqueLinkSlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.link.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};