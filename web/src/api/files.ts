import { apiRequest } from './client';

export type FileItem = {
  id: number;
  name: string;
  is_folder: boolean;
  size_bytes?: number;
  owner_email?: string;
  parent_id?: number | null;
};

export const fetchFiles = async (parentId?: number | null) => {
  const query = parentId ? `?parentId=${parentId}` : '';
  return apiRequest<FileItem[]>(`/api/files${query}`);
};
