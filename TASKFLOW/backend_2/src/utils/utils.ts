// 날짜 포맷팅 유틸리티 함수
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 이메일 유효성 검사 유틸리티 함수
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 강도 검사 유틸리티 함수
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
}; 