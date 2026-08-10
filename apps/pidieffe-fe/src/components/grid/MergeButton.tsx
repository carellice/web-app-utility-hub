import { usePdfLoader } from '../../hooks/usePdfLoader';
import { Button } from '../common/Button';
import { FileInput } from '../common/FileInput';
import { ACCEPTED_FILE_TYPES } from '../../constants/config';

export function MergeButton() {
  const { mergePdf } = usePdfLoader();

  return (
    <FileInput accept={ACCEPTED_FILE_TYPES} onFile={(file) => mergePdf(file)}>
      <Button variant="secondary" size="sm">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Aggiungi PDF
      </Button>
    </FileInput>
  );
}
