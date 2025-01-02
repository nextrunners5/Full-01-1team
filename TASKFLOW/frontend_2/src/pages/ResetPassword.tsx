import React, { useState } from "react";
import "../styles/ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "reset">("email"); // 이메일 단계 또는 비밀번호 재설정 단계
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setError("이메일 주소와 이름을 모두 입력해주세요.");
      setSuccess(null);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      setSuccess(null);
      return;
    }

    // 이메일 확인 성공으로 가정 (실제 API 통합 시 요청 필요)
    setError(null);
    setSuccess("이메일 확인이 완료되었습니다. 비밀번호를 재설정해주세요.");
    setStep("reset"); // 비밀번호 재설정 단계로 이동
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 비밀번호 재설정 성공으로 가정 (실제 API 통합 시 요청 필요)
    setError(null);
    setSuccess("비밀번호가 성공적으로 재설정되었습니다.");
    setStep("email"); // 초기화 (필요 시 다른 페이지로 이동)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        {step === "email" && (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">
              비밀번호 재설정
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              가입 시 등록한 이메일을 확인 후 비밀번호를 재설정하실 수 있습니다.
            </p>
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일 주소
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="홍길동"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                확인하기
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">
              비밀번호 재설정
            </h2>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  새 비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호 입력"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비밀번호 다시 입력"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                비밀번호 재설정
              </button>
            </form>
          </>
        )}

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-green-500 text-sm text-center">{success}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
