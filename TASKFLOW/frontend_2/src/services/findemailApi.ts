import API from '../api/axiosConfig';

export const findEmail = async (name: string, birthNumber: string) => {
  try {
    const response = await API.post('/find-email', {
      name,
      birthNumber
    });
    return response.data;
  } catch (error) {
    console.error('Failed to find email:', error);
    throw new Error('이메일 찾기 중 오류가 발생했습니다.');
  }
}; 