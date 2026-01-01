import { useMemo } from 'react';
import { IoCloudUploadOutline, IoFolderOpenOutline, IoHomeOutline, IoLogOutOutline, IoStarOutline } from 'react-icons/io5';
import { MdSearch, MdTextSnippet } from 'react-icons/md';
import { files } from '../data/files';

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

export default function Files() {
  const items = useMemo(
    () =>
      files.map((item) => ({
        ...item,
        icon: iconMap[item.type] ?? fileIcon,
      })),
    []
  );

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
          <button className="logout-button" type="button" aria-label="Se déconnecter">
            <IoLogOutOutline />
          </button>
        </div>

        <div className="files-heading">
          <h1>Mon SUPFile</h1>
          <p>Mes fichiers locaux • Dossier de test</p>
        </div>

        <section className="files-grid">
          {items.map((item) => (
            <article key={item.id} className="file-card">
              <div className="file-card-icon">
                <img src={item.icon} alt="" />
              </div>
              <h2>{item.name}</h2>
              <span>{item.type === 'folder' ? 'DOSSIER' : (item.extension ?? 'inconnu').toUpperCase()}</span>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
