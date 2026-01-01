export type FileCard = {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'word' | 'excel' | 'archive' | 'image' | 'text' | 'video' | 'unknown';
  extension?: string;
};

export const files: FileCard[] = [
  { id: 'folder-1', name: 'Dossier 1', type: 'folder' },
  { id: 'folder-2', name: 'Dossier 2', type: 'folder' },
  { id: 'pdf-1', name: 'Dossier PDF', type: 'pdf', extension: 'pdf' },
  { id: 'pdf-2', name: 'Fichier PDF 2', type: 'pdf', extension: 'pdf' },
  { id: 'word-1', name: 'Compte rendu', type: 'word', extension: 'docx' },
  { id: 'excel-1', name: 'Reporting trimestriel', type: 'excel', extension: 'xlsx' },
  { id: 'archive-1', name: 'Sauvegarde compressée', type: 'archive', extension: 'zip' },
  { id: 'image-1', name: 'Illustration HD', type: 'image', extension: 'png' },
  { id: 'text-1', name: 'Notes techniques', type: 'text', extension: 'txt' },
  { id: 'video-1', name: 'Présentation vidéo', type: 'video', extension: 'mp4' },
  { id: 'unknown-1', name: 'Fichier avec une extension inconnue 1', type: 'unknown', extension: 'bin' },
  { id: 'unknown-2', name: 'Fichier avec une extension inconnue 2', type: 'unknown', extension: 'bak' },
];
