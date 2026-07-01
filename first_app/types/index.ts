// types/index.ts
export interface Icon {
  id: number;
  name: string;
  label?: string;
}

export interface Link {
  id: number;
  slug: string;
  name: string;
  url: string;
  desc: string;
  iconName: string;
  status: 'online' | 'offline' | 'maintenance';
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  iconName: string;
  colorHex: string;
  links: Link[];
  createdAt: string;
  updatedAt: string;
}