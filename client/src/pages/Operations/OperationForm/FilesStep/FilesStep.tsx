import { useState } from 'react';
import { Button, Upload, Alert, Divider, Popconfirm, Tag } from 'antd';
import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  InboxOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  PictureOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { OperationFile } from '@/types';
import { resolveMediaUrl } from '@/utils/helpers';
import { ACCEPTED_FILE_TYPES } from '../wizardConstants';
import './FilesStep.scss';

export interface FilesStepProps {
  operationId: string | null;
  beforeFiles: OperationFile[];
  afterFiles: OperationFile[];
  onBeforeUpload: (file: File) => Promise<void>;
  onAfterUpload: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}

function getFileIcon(mimeType?: string) {
  if (mimeType?.startsWith('image/')) return <PictureOutlined />;
  if (mimeType === 'application/pdf') return <FilePdfOutlined />;
  return <FileTextOutlined />;
}

function formatFileSize(size?: number | null) {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesStep({
  operationId,
  beforeFiles,
  afterFiles,
  onBeforeUpload,
  onAfterUpload,
  onDeleteFile,
}: FilesStepProps) {
  const { t } = useTranslation();
  const [beforeUploading, setBeforeUploading] = useState(false);
  const [afterUploading, setAfterUploading] = useState(false);

  const handleBeforeUpload = async (file: File) => {
    setBeforeUploading(true);
    try {
      await onBeforeUpload(file);
    } finally {
      setBeforeUploading(false);
    }
    return false;
  };

  const handleAfterUpload = async (file: File) => {
    setAfterUploading(true);
    try {
      await onAfterUpload(file);
    } finally {
      setAfterUploading(false);
    }
    return false;
  };

  const renderFileGallery = (files: OperationFile[]) => {
    if (files.length === 0) {
      return (
        <div className="emptyFiles">
          <div className="emptyFilesIcon"><FileImageOutlined /></div>
          <div className="emptyFilesText">{t('operations.noFiles')}</div>
          <div className="emptyFilesHint">{t('operations.uploadFiles')}</div>
        </div>
      );
    }

    return (
      <div className="fileGallery">
        {files.map((file) => {
          const url = resolveMediaUrl(file.fileUrl || file.url, file.filePath);
          const isImage = file.mimeType?.startsWith('image/');
          return (
            <article key={file.id} className="fileCard">
              <div className="fileCardPreview">
                {isImage ? (
                  <img src={url} alt={file.fileName} className="fileCardImage" />
                ) : (
                  <div className="fileCardDocumentIcon">{getFileIcon(file.mimeType)}</div>
                )}
                <span className="fileCardType"><CheckCircleFilled /></span>
              </div>
              <div className="fileCardBody">
                <div className="fileCardName" title={file.fileName}>{file.fileName}</div>
                <div className="fileCardMeta">
                  <span>{file.mimeType?.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                  {file.fileSize ? <span>• {formatFileSize(file.fileSize)}</span> : null}
                </div>
                <div className="fileCardActions">
                  <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => window.open(url, '_blank')} aria-label={t('common.view')} />
                  <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => { const anchor = document.createElement('a'); anchor.href = url; anchor.download = file.fileName; anchor.click(); }} aria-label={t('common.download')} />
                  <Popconfirm title={t('operations.deleteFile')} onConfirm={() => onDeleteFile(file.id)} okText={t('common.yes')} cancelText={t('common.no')}>
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label={t('common.delete')} />
                  </Popconfirm>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderUploadArea = (type: 'before' | 'after', uploading: boolean, onUpload: (file: File) => Promise<void>) => (
    <Upload.Dragger
      accept={ACCEPTED_FILE_TYPES}
      showUploadList={false}
      multiple
      beforeUpload={onUpload}
      disabled={uploading}
      className="uploadArea"
    >
      <div className="uploadContent">
        <div className="uploadIcon"><InboxOutlined /></div>
        <div className="uploadTitle">{uploading ? t('operations.uploading') : t('operations.uploadFiles')}</div>
        <div className="uploadHint">JPG, PNG, PDF, DICOM, video</div>
        <div className="uploadAction"><span>{t(type === 'before' ? 'operations.beforeOperation' : 'operations.afterOperation')}</span></div>
      </div>
    </Upload.Dragger>
  );

  const renderSection = (type: 'before' | 'after', files: OperationFile[], uploading: boolean, onUpload: (file: File) => Promise<void>) => {
    const isBefore = type === 'before';
    return (
      <section className={`fileSection ${isBefore ? 'fileSection--before' : 'fileSection--after'}`}>
        <div className="fileSectionHeader">
          <div className="fileSectionHeading">
            <div className="fileSectionIcon">{isBefore ? <CameraOutlined /> : <FileImageOutlined />}</div>
            <div>
              <div className="fileSectionTitle">{isBefore ? t('operations.beforeOperation') : t('operations.afterOperation')}</div>
              <div className="fileSectionSubtitle">{t('operations.uploadFiles')}</div>
            </div>
          </div>
          <Tag>{files.length} {files.length === 1 ? 'file' : 'files'}</Tag>
        </div>

        {operationId ? (
          <>
            {renderFileGallery(files)}
            {renderUploadArea(type, uploading, onUpload)}
          </>
        ) : (
          <Alert type="info" showIcon message={t('operations.step5Files')} description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'} className="noOperationAlert" />
        )}
      </section>
    );
  };

  return (
    <div className="stepContent filesStep">
      <div className="filesIntro">
        <div className="filesIntroIcon"><CameraOutlined /></div>
        <div>
          <h2>{t('operations.step5Files')}</h2>
          <p>{t('operations.uploadFiles')}</p>
        </div>
      </div>

      {renderSection('before', beforeFiles, beforeUploading, handleBeforeUpload)}
      <Divider className="filesDivider" />
      {renderSection('after', afterFiles, afterUploading, handleAfterUpload)}
    </div>
  );
}
