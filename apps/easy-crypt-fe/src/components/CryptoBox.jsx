import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { encryptText, decryptText } from '../utils/crypto';

export default function CryptoBox() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [outputExpanded, setOutputExpanded] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      showToast(t('toast.encryptEmpty'), 'error');
      return;
    }
    if (!password) {
      showToast(t('toast.passwordEmpty'), 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await encryptText(inputText, password);
      setOutputText(result);
      showToast(t('toast.encryptSuccess'));
    } catch {
      showToast(t('toast.encryptError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      showToast(t('toast.decryptEmpty'), 'error');
      return;
    }
    if (!password) {
      showToast(t('toast.passwordEmpty'), 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await decryptText(inputText, password);
      setOutputText(result);
      showToast(t('toast.decryptSuccess'));
    } catch {
      showToast(t('toast.decryptError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      showToast(t('toast.pasteSuccess'));
    } catch {
      showToast(t('toast.pasteError'), 'error');
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      showToast(t('toast.copyEmpty'), 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(outputText);
      showToast(t('toast.copySuccess'));
    } catch {
      showToast(t('toast.copyError'), 'error');
    }
  };

  const handleClear = () => {
    setInputText('');
    setPassword('');
    setOutputText('');
  };

  return (
    <div className="crypto-box">
      {/* Input Section */}
      <div className="field-group">
        <div className="field-header">
          <label htmlFor="input-text">{t('crypto.textLabel')}</label>
          <button className="btn-icon" onClick={handlePaste} title={t('crypto.paste')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
            {t('crypto.paste')}
          </button>
        </div>
        <textarea
          id="input-text"
          placeholder={t('crypto.inputPlaceholder')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
        />
      </div>

      {/* Password Section */}
      <div className="field-group">
        <label htmlFor="password">{t('crypto.passwordLabel')}</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('crypto.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn-icon btn-toggle-pw"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? t('crypto.hide') : t('crypto.show')}
            type="button"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button className="btn btn-encrypt" onClick={handleEncrypt} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {loading ? t('crypto.processing') : t('crypto.encrypt')}
        </button>
        <button className="btn btn-decrypt" onClick={handleDecrypt} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
          </svg>
          {loading ? t('crypto.processing') : t('crypto.decrypt')}
        </button>
        <button className="btn btn-clear" onClick={handleClear}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M8 6V4h8v2"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
          </svg>
          {t('crypto.clear')}
        </button>
      </div>

      {/* Output Section */}
      {outputText && (
        <div className={`field-group output-group${outputExpanded ? ' output-expanded' : ''}`}>
          <div className="field-header">
            <label htmlFor="output-text">{t('crypto.resultLabel')}</label>
            <div className="output-actions">
              <button className="btn-icon" onClick={() => setOutputExpanded(!outputExpanded)} title={outputExpanded ? t('crypto.collapse') : t('crypto.expand')}>
                {outputExpanded ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20"/>
                    <polyline points="20 10 14 10 14 4"/>
                    <line x1="14" y1="10" x2="21" y2="3"/>
                    <line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"/>
                    <polyline points="9 21 3 21 3 15"/>
                    <line x1="21" y1="3" x2="14" y2="10"/>
                    <line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                )}
                {outputExpanded ? t('crypto.collapse') : t('crypto.expand')}
              </button>
              <button className="btn-icon" onClick={handleCopy} title={t('crypto.copy')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {t('crypto.copy')}
              </button>
            </div>
          </div>
          <textarea
            id="output-text"
            value={outputText}
            readOnly
            rows={6}
            onClick={() => {
              if (window.matchMedia('(max-width: 480px)').matches && !outputExpanded) {
                setOutputExpanded(true);
              }
            }}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
