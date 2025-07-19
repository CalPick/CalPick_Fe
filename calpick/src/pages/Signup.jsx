import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import logo from "../assets/logo.svg";

function Signup() {
  const [userId, setUserId] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");

  const [idError, setIdError] = useState("");

  const navigate = useNavigate();

  const idRegex = /^[A-Za-z0-9]*$/;
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  const nicknameRegex = /^[가-힣A-Za-z0-9]*$/;

  // 아이디 입력 시 중복 검사 초기화 및 유효성 확인
  const handleIdChange = (e) => {
    const value = e.target.value;
    if (idRegex.test(value) && value.length <= 10) {
      setUserId(value);
      setIsDuplicate(false);
      setIdChecked(false);
      setIdError(value.length < 3 ? "3글자 이상 입력해주세요." : "");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (passwordRegex.test(value) && value.length <= 12) {
      setPassword(value);
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12) setConfirmPassword(value);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (nicknameRegex.test(value) && value.length <= 10) {
      setNickname(value);
    }
  };

  const handleBirthChange = (e) => {
    const value = e.target.value;
    const [year = "", month = "", day = ""] = value.split("-");

    // 연도 4자리 제한
    const trimmedYear = year.slice(0, 4);
    const newValue = [trimmedYear, month, day].filter(Boolean).join("-");

    setBirth(newValue);
  };

 const handleDuplicateCheck = async () => {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}/api/auth/check?userId=${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.warn("JSON parse failed:", text);
    }

    if (response.ok) {
      setIdError("");
      setIsDuplicate(true);
    } else {
      setIdError(data.error || "중복 검사 실패");
      setIsDuplicate(false);
    }

    setIdChecked(true);
  } catch (error) {
    console.error("중복 체크 에러:", error);
    setIdError("서버 호출 중 오류가 발생했습니다.");
    setIsDuplicate(false);
  }
};

  const isFormValid = // 가입하기 활성화
    userId.length >= 3 &&
    password.length >= 6 &&
    password === confirmPassword &&
    birth.trim() !== "" &&
    nickname.length > 0 &&
    isDuplicate;

  const showPasswordError = password.length > 0 && password.length < 6;
  const showConfirmPasswordError =
    confirmPassword && confirmPassword !== password;

  const handleSubmit = async (e) => {
    //아디디, 비밀번호 확인
    e.preventDefault();

    if (!isDuplicate) {
      setIdError("아이디 중복 확인을 해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPassword("비밀번호가 일치하지 않습니다.");
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "";
    const url = `${baseUrl}/api/auth/signup`;
    const payload = {
      userId,
      password,
      birth,
      nickname,
    };

    console.log("👉 Request URL:", url);
    console.log("👉 Request Body:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("👈 Response status:", response.status);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
      console.log("👈 Response body:", data);

      if (response.ok) {
        navigate("/success", { state: { userId, password } });
      } else {
        alert(
          data.error || data.message || `회원가입 실패 (${response.status})`
        );
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      alert("서버 호출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      
      <div className="flex flex-row m-16 items-center justify-center gap-2">
        <img src={logo} alt="logo" className="h-[38px] w-[87px]" onClick={() => navigate("/landing")}/>
        <h1 className="text-[28px] font-black ">회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-90 flex flex-col gap-2">
        <label className="pl-2 text-sm">아이디</label>
        <div className="flex gap-2">
          <div className="relative w-full mb-1">
            <input
              type="text"
              placeholder="영문, 숫자 입력 가능"
              value={userId}
              onChange={handleIdChange}
              className={`w-full h-8 px-4 py-2 mb-1 pr-8 rounded-xl focus:outline-none border ${
                idError
                  ? "border-[#B3261E]"
                  : "focus:border-black border-gray-300"
              }`}
            />
            {isDuplicate && idChecked && (
              <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm" />
            )}
          </div>
          <button
            type="button"
            onClick={handleDuplicateCheck}
            disabled={userId.length < 3}
            className={`min-w-max px-5 h-8 mb-1 rounded-xl ${
              userId.length >= 3
                ? "bg-black text-white"
                : "bg-[#F4F4F4] text-gray-400"
            }`}
          >
            검사
          </button>
        </div>
        {idError && (
          <p className="text-xs text-[#B3261E] pl-2 -mt-3 mb-4">{idError}</p>
        )}

        <label className="pl-2 text-sm">비밀번호</label>
        <input
          type="password"
          placeholder="영문, 숫자, 특수문자 입력 가능"
          value={password}
          onChange={handlePasswordChange}
          className={`w-full px-4 h-8 py-2 mb-1 rounded-xl focus:outline-none border ${
            showPasswordError
              ? "border-[#B3261E]"
              : "focus:border-black border-gray-300"
          }`}
        />
        {showPasswordError && (
          <p className="text-xs text-[#B3261E] pl-2 -mt-2 mb-4">
            6자 이상 입력해주세요.
          </p>
        )}

        <label className="pl-2 text-sm">비밀번호 확인</label>
        <input
          type="password"
          placeholder="플레이스 홀더"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`w-full px-4 h-8 py-2 mb-1 rounded-xl focus:outline-none border ${
            showConfirmPasswordError
              ? "border-[#B3261E]"
              : "focus:border-black border-gray-300"
          }`}
        />
        {showConfirmPasswordError && (
          <p className="text-xs text-[#B3261E] pl-2 -mt-2 mb-4">
            비밀번호가 일치하지 않습니다.
          </p>
        )}

        <label className="pl-2 text-sm">생일</label>
        <input
          type="date"
          value={birth}
          onChange={handleBirthChange}
          className="w-full h-8 px-4 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:border-black"
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
          className="w-full h-8 px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
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
