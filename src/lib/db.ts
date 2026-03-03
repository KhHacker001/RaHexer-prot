import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export const readDB = <T>(filename: string): T[] => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeDB = <T>(filename: string, data: T[]): void => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
};

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  password: string;
}

export interface Visitor {
  id: string;
  ip: string;
  country: string;
  device: string;
  browser: string;
  visitTime: string;
  path: string;
}
