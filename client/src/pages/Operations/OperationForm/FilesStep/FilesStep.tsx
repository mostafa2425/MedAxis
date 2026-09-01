import { useState } from 'react';
import { Button, Upload, Alert, Divider, Popconfirm, Tag, Modal, Input } from 'antd';
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
  LinkOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { OperationFile } from '@/types';
import { operationService } from '@/services/operation.service';
import { resolveMediaUrl } from '@/utils/helpers';
import { ACCEPTED_FILE_TYPES } from '../wizardConstants';
import './FilesStep.scss';

export interface FilesStepProps {
  operationId: string | null;
  beforeFiles: OperationFile[];
  afterFiles: OperationFile[];
  onBeforeUpload: (file: File) => Promise<void>;
  onAfterUpload: (file: File) => Promise<void>;
  onAddExternalLink?: (fileType: 'before' | 'after', url: string, fileName: string) => Promise<void>;
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

function isGoogleDriveLink(file: OperationFile) {
  return /^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(file.filePath || '');
}

export default function FilesStep({
  operationId,
  beforeFiles,
  afterFiles,
  onBeforeUpload,
  onAfterUpload,
  onAddExternalLink,
  onDeleteFile,
}: FilesStepProps) {
  const { t } = useTranslation();
  const [beforeUploading, setBeforeUploading] = useState(false);
  const [afterUploading, setAfterUploading] = useState(false);
  const [externalModalOpen, setExternalModalOpen] = useState(false);
  const [externalType, setExternalType] = useState<'before' | 'after'>('before');
  const [externalUrl, setExternalUrl] = useState('');
  const [externalFileName, setExternalFileName] = useState('');
  const [externalSaving, setExternalSaving] = useState(false);

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

  const openExternalModal = (type: 'before' | 'after') => {
    setExternalType(type);
    setExternalUrl('');
    setExternalFileName('');
    setExternalModalOpen(true);
  };

  const closeExternalModal = () => {
    if (externalSaving) return;
    setExternalModalOpen(false);
  };

  const saveExternalLink = async () => {
    if (!operationId || !externalUrl.trim() || !externalFileName.trim()) return;
    setExternalSaving(true);
    try {
      if (onAddExternalLink) {
        await onAddExternalLink(externalType, externalUrl.trim(), externalFileName.trim());
      } else {
        await operationService.addExternalFile(operationId, {
          url: externalUrl.trim(),
          fileName: externalFileName.trim(),
          fileType: externalType === 'before' ? 'BEFORE_IMAGE' : 'AFTER_IMAGE',
        });
        window.location.reload();
      }
      setExternalModalOpen(false);
      setExternalUrl('');
      setExternalFileName('');
    } finally {
      setExternalSaving(false);
    }
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
          const external = isGoogleDriveLink(file);
          const url = external ? (file.fileUrl || file.url || file.filePath || '') : resolveMediaUrl(file.fileUrl || file.url, file.filePath);
          const isImage = !external && file.mimeType?.startsWith('image/');
          return (
            <article key={file.id} className="fileCard">
              <div className="fileCardPreview">
                {isImage ? (
                  <img src={url} alt={file.fileName} className="fileCardImage" />
                ) : (
                  <div className="fileCardDocumentIcon">{external ? <CloudOutlined /> : getFileIcon(file.mimeType)}</div>
                )}
                <span className="fileCardType"><CheckCircleFilled /></span>
              </div>
              <div className="fileCardBody">
                <div className="fileCardName" title={file.fileName}>{file.fileName}</div>
                <div className="fileCardMeta">
                  <span>{external ? 'Google Drive' : file.mimeType?.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                  {!external && file.fileSize ? <span>• {formatFileSize(file.fileSize)}</span> : null}
                </div>
                <div className="fileCardActions">
                  <Button type="text" size="small" icon={external ? <LinkOutlined /> : <EyeOutlined />} onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} aria-label={t('common.view')} />
                  {!external ? (
                    <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => { const anchor = document.createElement('a'); anchor.href = url; anchor.download = file.fileName; anchor.click(); }} aria-label={t('common.download')} />
                  ) : null}
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
    <>
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
      <div className="externalFileOption">
        <Button type="link" icon={<CloudOutlined />} onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer')}>
          Google Drive
        </Button>
        <Button type="link" icon={<LinkOutlined />} onClick={() => openExternalModal(type)}>
          {t('common.add')}
        </Button>
      </div>
    </>
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

      <Modal
        open={externalModalOpen}
        title="Google Drive"
        onCancel={closeExternalModal}
        onOk={saveExternalLink}
        okText={t('common.add')}
        cancelText={t('common.cancel')}
        confirmLoading={externalSaving}
        destroyOnHidden
      >
        <div className="externalLinkForm">
          <Input
            value={externalFileName}
            onChange={(event) => setExternalFileName(event.target.value)}
            placeholder={t('common.name')}
            autoFocus
          />
          <Input
            value={externalUrl}
            onChange={(event) => setExternalUrl(event.target.value)}
            placeholder="https://drive.google.com/..."
            prefix={<LinkOutlined />}
          />
        </div>
      </Modal>
    </div>
  );
}
