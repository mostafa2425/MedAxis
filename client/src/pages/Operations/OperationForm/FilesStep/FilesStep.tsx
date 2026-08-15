import { useState } from 'react';
import { Button, Upload, Alert, Divider, Popconfirm } from 'antd';
import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  InboxOutlined,
  FileImageOutlined,
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
    return false; // prevent default upload
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
          <FileImageOutlined style={{ fontSize: 32, color: '#CBD5E1' }} />
          <span>{t('operations.noFiles')}</span>
        </div>
      );
    }
    return (
      <div className="fileGallery">
        {files.map((f) => (
          <div key={f.id} className="fileThumb">
            <div className="fileThumbPreview">
              {f.mimeType?.startsWith('image/') ? (
                <img src={resolveMediaUrl(f.fileUrl || f.url, f.filePath)} alt={f.fileName} className="fileThumbImg" />
              ) : (
                <FileImageOutlined style={{ fontSize: 24, color: '#94A3B8' }} />
              )}
            </div>
            <div className="fileThumbName">{f.fileName}</div>
            <div className="fileThumbActions">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => window.open(resolveMediaUrl(f.fileUrl || f.url, f.filePath), '_blank')}
              />
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = resolveMediaUrl(f.fileUrl || f.url, f.filePath);
                  a.download = f.fileName;
                  a.click();
                }}
              />
              <Popconfirm
                title={t('operations.deleteFile')}
                onConfirm={() => onDeleteFile(f.id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="stepContent">
      {/* ─── Before Operation ─────────────────── */}
      <div className="fileSection">
        <div className="fileSectionHeader">
          <CameraOutlined className="fileSectionIcon" />
          <h3 className="fileSectionTitle">{t('operations.beforeOperation')}</h3>
        </div>

        {operationId && (
          <>
            {renderFileGallery(beforeFiles)}
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleBeforeUpload}
              disabled={beforeUploading}
              className="uploadArea"
            >
              <p className="uploadIcon">
                <InboxOutlined />
              </p>
              <p className="uploadText">
                {beforeUploading ? t('operations.uploading') : t('operations.uploadFiles')}
              </p>
              <p className="uploadHint">
                JPG, PNG, PDF, DICOM
              </p>
            </Upload.Dragger>
          </>
        )}

        {!operationId && (
          <Alert
            type="info"
            showIcon
            message={t('operations.step5Files')}
            description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'}
            className="noOperationAlert"
          />
        )}
      </div>

      <Divider />

      {/* ─── After Operation ──────────────────── */}
      <div className="fileSection">
        <div className="fileSectionHeader">
          <FileImageOutlined className="fileSectionIcon" />
          <h3 className="fileSectionTitle">{t('operations.afterOperation')}</h3>
        </div>

        {operationId && (
          <>
            {renderFileGallery(afterFiles)}
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleAfterUpload}
              disabled={afterUploading}
              className="uploadArea"
            >
              <p className="uploadIcon">
                <InboxOutlined />
              </p>
              <p className="uploadText">
                {afterUploading ? t('operations.uploading') : t('operations.uploadFiles')}
              </p>
              <p className="uploadHint">
                JPG, PNG, PDF, DICOM
              </p>
            </Upload.Dragger>
          </>
        )}

        {!operationId && (
          <Alert
            type="info"
            showIcon
            message={t('operations.step5Files')}
            description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'}
            className="noOperationAlert"
          />
        )}
      </div>
    </div>
  );
}
