import { uploadImage } from '@/api/image';
import { useToast } from '@/hooks/useToast';

interface UseImageUploadOptions {
  invalidTypeMessage?: string;
  maxSizeInMB?: number;
  sizeExceededMessage?: string;
  maxWidth?: number;
  maxHeight?: number;
  compressionQuality?: number;
  uploadErrorMessage?: string;
  onSuccess?: (imageUrl: string) => void;
}

const COMPRESSIBLE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const getResizedDimensions = ({
  width,
  height,
  maxWidth,
  maxHeight,
}: {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
}) => {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

const loadImage = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지를 불러오지 못했습니다.'));
    };
    image.src = objectUrl;
  });
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
};

const optimizeImageFile = async ({
  file,
  maxWidth,
  maxHeight,
  compressionQuality,
}: {
  file: File;
  maxWidth: number;
  maxHeight: number;
  compressionQuality: number;
}) => {
  if (!COMPRESSIBLE_IMAGE_TYPES.includes(file.type)) return file;

  try {
    const image = await loadImage(file);
    const dimensions = getResizedDimensions({
      width: image.naturalWidth,
      height: image.naturalHeight,
      maxWidth,
      maxHeight,
    });

    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    const outputType = file.type === 'image/png' ? 'image/webp' : file.type;
    const blob = await canvasToBlob(canvas, outputType, compressionQuality);

    if (!blob || blob.size >= file.size) return file;

    const extension = outputType.split('/')[1] ?? 'jpg';
    const fileName = file.name.replace(/\.[^.]+$/, `.${extension}`);

    return new File([blob], fileName, {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('이미지 최적화 실패:', error);
    return file;
  }
};

export const useImageUpload = ({
  invalidTypeMessage = '이미지 파일만 업로드 가능합니다.',
  maxSizeInMB = 5,
  sizeExceededMessage,
  maxWidth = 1600,
  maxHeight = 1600,
  compressionQuality = 0.82,
  uploadErrorMessage = '이미지 업로드에 실패했습니다.',
  onSuccess,
}: UseImageUploadOptions = {}) => {
  const { showToast } = useToast();

  const uploadImageFile = async (file?: File | null) => {
    if (!file) return null;

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: invalidTypeMessage });
      return null;
    }

    const optimizedFile = await optimizeImageFile({
      file,
      maxWidth,
      maxHeight,
      compressionQuality,
    });

    if (optimizedFile.size > maxSizeInMB * 1024 * 1024) {
      showToast({
        type: 'error',
        message: sizeExceededMessage ?? `${maxSizeInMB}MB 이하의 이미지만 업로드 가능합니다.`,
      });
      return null;
    }

    try {
      const imageUrl = await uploadImage(optimizedFile);
      onSuccess?.(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      showToast({ type: 'error', message: uploadErrorMessage });
      return null;
    }
  };

  return { uploadImageFile };
};
