import { useMemo, useState } from 'react';
import { FaEllipsisH, FaFacebookSquare, FaGoogle, FaInstagram, FaYoutube } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { login, register } from '../api/auth';

const externalLinks = [
  { label: 'CGU/CGV', url: 'https://example.com/terms' },
  { label: 'Politique de confidentialité', url: 'https://example.com/privacy' },
  { label: 'Copyright SUPFile', url: 'https://example.com/copyright' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isDisabled = useMemo(() => !email || !password, [email, password]);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(normalizedEmail, normalizedPassword);
      navigate('/files');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de se connecter pour l'instant.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register(normalizedEmail, normalizedPassword);
      navigate('/files');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de créer le compte pour l'instant.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="login-screen">
      <header className="login-header">
        <button className="icon-button" type="button" aria-label="Options de connexion">
          <FaEllipsisH />
        </button>
      </header>

      <div className="login-logo">
        <div className="logo-icon">
          <IoCloudUploadOutline />
        </div>
        <span>SUPFile</span>
      </div>

      <p className="login-subtitle">Se connecter avec</p>

      <div className="input-card">
        <label>
          <span>Courriel</span>
          <div className="input-row">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="Adresse email"
            />
            <MdChevronRight />
          </div>
        </label>
      </div>

      <div className="input-card">
        <label>
          <span>Mot de passe</span>
          <div className="input-row">
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-label="Mot de passe"
            />
            <MdChevronRight />
          </div>
        </label>
      </div>

      <button className="primary-button" type="button" disabled={isDisabled || isLoading} onClick={handleLogin}>
        {isLoading ? 'Connexion…' : 'Connexion'}
      </button>

      {error ? <p className="error-text">{error}</p> : null}

      <p className="or-text">Ou avec</p>

      <button className="google-button" type="button" aria-label="Connexion avec Google">
        <span>
          <FaGoogle className="google-icon" />
          Votre compte Google
        </span>
        <MdChevronRight />
      </button>

      <div className="signup-row">
        <span>Vous n'avez pas de compte ?</span>
        <button type="button" className="text-link" onClick={handleRegister} disabled={isDisabled || isLoading}>
          S'inscrire
        </button>
      </div>

      <footer className="social-bar">
        <div className="social-icons">
          <FaFacebookSquare />
          <FaInstagram />
          <FaYoutube />
        </div>
        <div className="social-links">
          {externalLinks.map((item) => (
            <button key={item.label} type="button" onClick={() => openExternal(item.url)}>
              {item.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
