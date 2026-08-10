import { useRef, type ReactNode } from 'react';

interface FileInputProps {
  accept: string;
  onFile: (file: File) => void;
  children: ReactNode;
}

export function FileInput({ accept, onFile, children }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFile(file);
            e.target.value = '';
          }
        }}
      />
      <div onClick={() => inputRef.current?.click()}>{children}</div>
    </>
  );
}
