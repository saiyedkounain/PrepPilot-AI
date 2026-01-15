import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';

export const uploadProfileImage = async (file) => {
  if (!file) return '';

  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.imageUrl;
};