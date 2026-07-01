// src/services/icon.service.ts
import { prisma } from '../config/database';

export const validateIconExists = async (iconName: string) => {
  const icon = await prisma.icon.findUnique({
    where: { name: iconName },
  });
  if (!icon) {
    throw new Error(`Icon "${iconName}" does not exist`);
  }
  return icon;
};

export class IconService {
  async findAll() {
    return await prisma.icon.findMany({
      include: {
        category: true,
        links: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number) {
    const icon = await prisma.icon.findUnique({
      where: { id },
      include: {
        category: true,
        links: true,
      },
    });
    if (!icon) throw new Error('Icon not found');
    return icon;
  }

  async findByName(name: string) {
    const icon = await prisma.icon.findUnique({
      where: { name },
      include: {
        category: true,
        links: true,
      },
    });
    if (!icon) throw new Error('Icon not found');
    return icon;
  }

  async create(data: {
    name: string;
    label?: string;
  }) {
    // Check if icon already exists
    const existing = await prisma.icon.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new Error(`Icon "${data.name}" already exists`);
    }

    return await prisma.icon.create({
      data: {
        name: data.name,
        label: data.label || null,
      },
    });
  }

  async createMany(dataArray: {
    name: string;
    label?: string;
  }[]) {
    return await prisma.icon.createMany({
      data: dataArray.map(data => ({
        name: data.name,
        label: data.label || null,
      })),
      skipDuplicates: true,
    });
  }

  async update(id: number, data: {
    name?: string;
    label?: string;
  }) {
    const existing = await prisma.icon.findUnique({
      where: { id },
    });
    if (!existing) throw new Error('Icon not found');

    if (data.name && data.name !== existing.name) {
      const conflict = await prisma.icon.findUnique({
        where: { name: data.name },
      });
      if (conflict) {
        throw new Error(`Icon "${data.name}" already exists`);
      }
    }

    return await prisma.icon.update({
      where: { id },
      data: {
        name: data.name,
        label: data.label,
      },
    });
  }

  async delete(id: number) {
    try {
      return await prisma.icon.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Icon not found');
      throw error;
    }
  }

  async deleteByName(name: string) {
    try {
      return await prisma.icon.delete({ where: { name } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('Icon not found');
      throw error;
    }
  }

  async getDefaultIcons() {
    const defaultIcons = [
      'FaQuestion',
      'FaGavel',
      'FaBalanceScale',
      'FaDatabase',
      'FaBookOpen',
      'FaGlobe',
      'FaMapMarkerAlt',
      'FaComment',
      'FaPeopleArrows',
      'FaCompressArrowsAlt',
      'FaBroadcastTower',
      'FaFolderOpen',
      'FaClipboardList',
      'FaLandmark',
      'FaEnvelope',
      'FaMailBulk',
      'FaUserTie',
      'FaMoneyBillWave',
      'FaBook',
    ];

    return await prisma.icon.findMany({
      where: {
        name: { in: defaultIcons },
      },
    });
  }

  async seedDefaultIcons() {
    const defaultIcons = [
      { name: 'FaQuestion', label: 'Default Icon' },
      { name: 'FaGavel', label: 'Gavel' },
      { name: 'FaBalanceScale', label: 'Balance Scale' },
      { name: 'FaDatabase', label: 'Database' },
      { name: 'FaBookOpen', label: 'Book Open' },
      { name: 'FaGlobe', label: 'Globe' },
      { name: 'FaMapMarkerAlt', label: 'Map Marker' },
      { name: 'FaComment', label: 'Comment' },
      { name: 'FaPeopleArrows', label: 'People Arrows' },
      { name: 'FaCompressArrowsAlt', label: 'Compress Arrows' },
      { name: 'FaBroadcastTower', label: 'Broadcast Tower' },
      { name: 'FaFolderOpen', label: 'Folder Open' },
      { name: 'FaClipboardList', label: 'Clipboard List' },
      { name: 'FaLandmark', label: 'Landmark' },
      { name: 'FaEnvelope', label: 'Envelope' },
      { name: 'FaMailBulk', label: 'Mail Bulk' },
      { name: 'FaUserTie', label: 'User Tie' },
      { name: 'FaMoneyBillWave', label: 'Money Bill Wave' },
      { name: 'FaBook', label: 'Book' },
    ];

    return await prisma.icon.createMany({
      data: defaultIcons,
      skipDuplicates: true,
    });
  }
}