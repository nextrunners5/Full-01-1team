import API from '../api/axiosConfig';

export const findEmail = async (name: string, birthNumber: string) => {
  try {
    const response = await API.post('/auth/find-email', {
      name,
      birthNumber
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || '이메일 찾기에 실패했습니다.');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.status === 404) {
      throw new Error('일치하는 사용자 정보를 찾을 수 없습니다.');
    }
    throw new Error('이메일 찾기 중 오류가 발생했습니다.');
  }
};
