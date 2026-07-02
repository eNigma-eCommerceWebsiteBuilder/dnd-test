'use client';

import type { ChangeEvent } from 'react';

interface ImageUploaderProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
}

export function ImageUploader({ files, onFilesChange }: ImageUploaderProps) {
    const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFiles = Array.from(event.target.files ?? []);
        onFilesChange(nextFiles);
    };

    return (
        <div className="@container w-full flex flex-col gap-3">
            <label className="text-sm font-semibold text-text-base" htmlFor="return-photos">
                Photos of the item (optional)
            </label>
            <div className="flex flex-col gap-3 rounded-card border border-dashed border-border bg-sunken p-4 text-center text-sm text-text-muted">
                <input
                    id="return-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="text-sm"
                />
                <span>Upload clear photos to help us review your return.</span>
            </div>
            {files.length > 0 ? (
                <div className="flex flex-col gap-1 text-xs text-text-muted">
                    {files.map((file) => (
                        <span key={file.name}>{file.name}</span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
