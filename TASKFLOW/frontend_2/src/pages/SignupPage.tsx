import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Signup.css";
import API from '../api/axiosConfig';

const SignupPage: React.FC = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        birthdate: '',
        gender: '',
        idNumberFront: '',
        idNumberBack: '',
        agree1: false,
        agree2: false,
    });

    // Check if the user agreed to terms in the previous page
    useEffect(() => {
        const state = location.state as { agree1?: boolean; agree2?: boolean };
        if (state) {
            setFormData((prevData) => ({
                ...prevData,
                agree1: state.agree1 || false,
                agree2: state.agree2 || false,
            }));
        }
    }, [location.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isStrongPassword = (password: string) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleEmailDuplicationCheck = async () => {
        try {
            if (!isValidEmail(formData.email)) {
                alert('유효하지 않은 이메일 형식입니다.');
                return;
            }

            const response = await API.post('/signup/check-email', { 
                email: formData.email 
            });

            if (response.status === 200) {
                alert("사용 가능한 이메일입니다.");
            } else {
                alert(response.data.message || "이미 사용 중인 이메일입니다.");
            }
        } catch (error) {
            console.error('Error checking email:', error);
            alert('이메일 중복 확인 중 문제가 발생했습니다.');
        }
    };

    const sendToBackend = async (data: typeof formData) => {
        try {
            const fullIdNumber = `${data.idNumberFront}-${data.idNumberBack}`;
            
            const response = await API.post('/signup', {
                email: data.email,
                password: data.password,
                name: data.name,
                birthdate: data.birthdate,
                gender: data.gender,
                idNumber: fullIdNumber,
            });

            if (response.status === 200) {
                alert(response.data.message);
                window.location.href = '/login';
            } else {
                alert(response.data.message || "회원가입 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const isValidIdNumber = (front: string, back: string) => {
        const frontRegex = /^\d{6}$/;
        const backRegex = /^\d{7}$/;
        return frontRegex.test(front) && backRegex.test(back);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            alert('유효하지 않은 이메일 형식입니다.');
            return;
        }

        if (!isStrongPassword(formData.password)) {
            alert('비밀번호는 8자 이상이며, 문자, 숫자, 특수문자를 포함해야 합니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        if (!isValidIdNumber(formData.idNumberFront, formData.idNumberBack)) {
            alert("올바른 주민등록번호 형식이 아닙니다.");
            return;
        }

        sendToBackend(formData);
    };

    return (
        <div className="signup-container">
            <h1 className="signup-title">회원가입</h1>
            <p className="signup-subtitle">서비스 이용을 위해 회원가입이 필요합니다</p>

            <form onSubmit={handleSubmit} className="signup-form">
                <div className="email-container">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                    <button
                        type="button"
                        onClick={handleEmailDuplicationCheck}
                        className="verify-button"
                    >
                        이메일 중복확인
                    </button>
                </div>

                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="영문, 숫자, 특수문자 조합 8-20자"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field"
                />

                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input-field"
                />

                <label htmlFor="name">이름 (닉네임)</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름을 입력해주세요"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                />

                <label htmlFor="birthdate">생년월일</label>
                <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    className="input-field"
                />

                <label>성별</label>
                <div className="inline-radio-group">
    <div className="radio-option">
        <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
        />
        <label htmlFor="male">남성</label>
    </div>
    <div className="radio-option">
        <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
        />
        <label htmlFor="female">여성</label>
    </div>
</div>


<div className="id-number-section">
    <label htmlFor="idNumberFront">주민등록번호</label>
    <div className="id-number-container">
        <input
            type="text"
            name="idNumberFront"
            value={formData.idNumberFront}
            onChange={handleChange}
            maxLength={6}
            placeholder="앞자리"
            className="id-number-input"
        />
        <span className="id-number-dash">-</span>
        <input
            type="password"
            name="idNumberBack"
            value={formData.idNumberBack}
            onChange={handleChange}
            maxLength={7}
            placeholder="뒷자리"
            className="id-number-input"
        />
    </div>
</div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="agree1"
                        name="agree1"
                        checked={formData.agree1}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="agree1">
                        <a
                            href="/terms"
                            className="link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            개인정보 수집 및 이용 동의 (필수)
                        </a>
                    </label>
                </div>
                
                <button type="submit" className="button">회원가입 완료</button>
            </form>
        </div>
    );
};

export default SignupPage;
