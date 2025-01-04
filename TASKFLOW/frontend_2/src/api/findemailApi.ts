import axios from 'axios';

const API_BASE_URL = 'http://localhost:3500/api';

// 이메일 찾기 API 호출 함수
export const findEmail = async (name: string, birthNumber: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/find-email`, {
      name,
      birthNumber,
    });

    return response.data; // 필요한 데이터만 반환
  } catch (error) {
    throw error; // 에러는 호출한 쪽에서 처리
  }
};
