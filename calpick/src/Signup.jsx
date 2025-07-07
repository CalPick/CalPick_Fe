import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

function Signup() {
  const [userId, setUserId] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const isIdEntered = userId.length > 0;

  const isFormValid =
userId.length > 0 &&
  password.length > 0 &&
  confirmPassword.length > 0 &&
  birth.trim() !== "" &&
  nickname.length > 0;

  const handleDuplicateCheck = () => {
    if (userId.length < 3) {
      alert("아이디는 3자 이상이어야 합니다.");
      return;
    }

    setIsDuplicate(true);
    alert("사용 가능한 아이디입니다.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDuplicate) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/success");
      } else {
        alert(data.error || "회원가입 실패");
      }
    } catch (error) {
      alert("서버 오류");
    }
  };

  const idRegex = /^[A-Za-z0-9]*$/;

  const handleIdChange = (e) => {
  const value = e.target.value;
  if (idRegex.test(value)&& value.length <= 10) {
    setUserId(value);
    setIsDuplicate(false);
  }
};

const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

const handlePasswordChange = (e) => {
  const value = e.target.value;
  if (passwordRegex.test(value) && value.length <= 12) {
    setPassword(value);
  }
};

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12) setConfirmPassword(value);
  };

  const nicknameRegex = /^[가-힣A-Za-z0-9]*$/;

const handleNicknameChange = (e) => {
  const value = e.target.value;
  if (nicknameRegex.test(value) && value.length <= 10) {
    setNickname(value);
  }
};

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 className="text-2xl font-black m-16">회원가입</h1>

    <form onSubmit={handleSubmit} className="w-90 flex flex-col gap-2">

      <label className="pl-2 text-sm">아이디</label>

      <div className="flex gap-2">
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="영문, 숫자 입력 가능"
            value={userId}
            onChange={handleIdChange}
            className="w-full h-8 px-4 py-2 pr-8 border border-gray-300 rounded-xl focus:outline-none"
          />
          {isDuplicate && (
            <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm" />
          )}
        </div>

        <button
          type="button"
          onClick={handleDuplicateCheck}  // ✅ 검사 버튼 기능 추가
          className={`min-w-max px-5 h-8 mb-4 rounded-xl border border-none ${
            isIdEntered ? "bg-black text-white" : "bg-[#F4F4F4] text-gray-400"
          }`}
        >
          검사
        </button>
      </div>

        <label className="pl-2 text-sm">비밀번호</label>
        <input
          type="password"
          placeholder="영문, 숫자, 특수문자 입력 가능"
          value={password}
          onChange={handlePasswordChange}
          className="w-full px-4 h-8 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none"
        />

        <label className="pl-2 text-sm">비밀번호 확인</label>
        <input
          type="password"
          placeholder="플레이스 홀더"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full px-4 h-8 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none"
        />

        <label className="pl-2 text-sm">생일</label>
        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          className="w-full h-8 px-4 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none"
        />
        <p className="pl-2 mb-4 text-xs">
          내 생일과 친구 생일이 달력에 표시돼요.
        </p>

        <label className="pl-2 text-sm">닉네임</label>
        <input
          type="text"
          placeholder="한글, 영문, 숫자 입력 가능"
          value={nickname}
          onChange={handleNicknameChange}
          className="w-full h-8 px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none"
        />

        <p className="pl-2 text-sm mt-2 font-semibold text-center">
          아이디와 비밀번호를 분실하지 않게 주의해주세요.
        </p>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2.5 mt-8 font-bold rounded-xl ${
            isFormValid ? "bg-black text-white" : "bg-[#F4F4F4] text-gray-400"
          }`}
        >
          가입하기
        </button>
      </form>

      <p className="mt-4 mb-16 text-sm text-gray-500">
        계정이 있다면{" "}
        <Link to="/login" className="text-black">
          로그인 →
        </Link>
      </p>
    </div>
  );
}

export default Signup;
