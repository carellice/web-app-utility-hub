import { LEVEL_META } from '../data/catalog.js';
import { useT } from '../context/LanguageContext.jsx';

export default function LevelChip({ level, size = 'md' }) {
  const t = useT();
  const key = String(level).toLowerCase();
  const meta = LEVEL_META[key];
  if (!meta) return null;
  const Icon = meta.icon;
  const sm = size === 'sm';
  const label = sm
    ? t(`levelMeta.${key}.short`)
    : t(`levelMeta.${key}.label`);
  return (
    <span
      className={`type-badge type-badge--${key} ${sm ? 'type-badge--sm' : ''}`}
      style={{
        '--type-color': meta.color
      }}
    >
      <Icon size={sm ? 12 : 14} strokeWidth={2.5} aria-hidden />
      <span>{label}</span>
    </span>
  );
}
