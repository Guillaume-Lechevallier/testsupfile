import { useEffect, useMemo, useState } from 'react';
import { IoCloudUploadOutline, IoFolderOpenOutline, IoHomeOutline, IoLogOutOutline, IoStarOutline } from 'react-icons/io5';
import { MdSearch, MdTextSnippet } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ApiError, clearToken, getToken } from '../api/client';
import { fetchFiles, FileItem } from '../api/files';

import folderIcon from '@mobile-assets/icons/folder.png';
import pdfIcon from '@mobile-assets/icons/pdf.png';
import wordIcon from '@mobile-assets/icons/word.png';
import excelIcon from '@mobile-assets/icons/excel.png';
import archiveIcon from '@mobile-assets/icons/archive.png';
import imageIcon from '@mobile-assets/icons/image.png';
import textIcon from '@mobile-assets/icons/text.png';
import videoIcon from '@mobile-assets/icons/video.png';
import fileIcon from '@mobile-assets/icons/file.png';

const iconMap = {
  folder: folderIcon,
  pdf: pdfIcon,
  word: wordIcon,
  excel: excelIcon,
  archive: archiveIcon,
  image: imageIcon,
  text: textIcon,
  video: videoIcon,
  unknown: fileIcon,
};

type FileCard = {
  id: number;
  name: string;
  type: keyof typeof iconMap;
  extension?: string;
};

const extensionMap: Record<string, FileCard['type']> = {
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  odt: 'word',
  xls: 'excel',
  xlsx: 'excel',
  csv: 'excel',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  txt: 'text',
  md: 'text',
  mp4: 'video',
  mov: 'video',
  mkv: 'video',
};

const toCard = (item: FileItem): FileCard => {
  if (item.is_folder) {
    return { id: item.id, name: item.name, type: 'folder' };
  }

  const extension = item.name.includes('.') ? item.name.split('.').pop()?.toLowerCase() : undefined;
  const type = (extension && extensionMap[extension]) || 'unknown';

  return { id: item.id, name: item.name, type, extension };
};

export default function Files() {
  const [items, setItems] = useState<FileCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFiles();
        setItems(data.map(toCard));
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          navigate('/');
          return;
        }
        const message = err instanceof ApiError ? err.message : "Impossible de charger les fichiers.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [navigate]);

  const cards = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        icon: iconMap[item.type] ?? fileIcon,
      })),
    [items]
  );

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  return (
    <div className="files-screen">
      <aside className="files-sidebar">
        <div className="sidebar-top">
          <IoCloudUploadOutline />
          <span>SUPFile</span>
        </div>
        <div className="sidebar-links">
          <IoHomeOutline />
          <IoFolderOpenOutline />
          <MdTextSnippet />
          <IoStarOutline />
        </div>
      </aside>

      <main className="files-content">
        <div className="files-topbar">
          <label className="search-bar">
            <MdSearch />
            <input type="text" placeholder="Rechercher un fichier ou un dossier" />
          </label>
          <button className="logout-button" type="button" aria-label="Se déconnecter" onClick={handleLogout}>
            <IoLogOutOutline />
          </button>
        </div>

        <div className="files-heading">
          <h1>Mon SUPFile</h1>
          <p>Mes fichiers locaux • Dossier de test</p>
        </div>

        {isLoading ? <p>Chargement des fichiers...</p> : null}
        {error ? <p className="files-error">{error}</p> : null}

        {!isLoading && !error && cards.length === 0 ? (
          <p>Aucun fichier disponible pour le moment.</p>
        ) : (
          <section className="files-grid">
            {cards.map((item) => (
              <article key={item.id} className="file-card">
                <div className="file-card-icon">
                  <img src={item.icon} alt="" />
                </div>
                <h2>{item.name}</h2>
                <span>{item.type === 'folder' ? 'DOSSIER' : (item.extension ?? 'inconnu').toUpperCase()}</span>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
