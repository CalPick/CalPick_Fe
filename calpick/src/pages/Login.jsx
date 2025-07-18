import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const isFormValid = userId.length > 0 && password.length > 0 && !userIdError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseUrl = import.meta.env.VITE_API_URL || "";
    const url = `${baseUrl}/api/auth/login`;
    const payload = { userId, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("nickname", data.nickname);
        setUserIdError("");
        setPasswordError("");
        navigate("/"); // 메인화면으로 이동
      } else { //에러 메시지
        if (data.error?.includes("아이디")) {
          setUserIdError("존재하지 않는 아이디입니다.");
          setPasswordError("");
        } else if (data.error?.includes("비밀번호")) {
          setUserIdError("");
          setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
          setUserIdError("로그인 실패");
          setPasswordError("");
        }
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      setUserIdError("서버 오류");
      setPasswordError("");
      setLoginSuccess(false);
    }
  };

   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      
      <div className="flex flex-row m-16 items-center justify-center gap-2">
        <img src={logo} alt="logo" className="h-[38px] w-[87px]" onClick={() => navigate("/landing")}/>
        <h1 className="text-[28px] font-black ">로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-90 flex flex-col gap-2">
        <label className="pl-2 text-sm">아이디</label>
        <input
          type="text"
          placeholder="영문, 숫자, 특수문자 입력 가능"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setUserIdError("");
          }}
          className={`w-full h-8 px-4 py-2 border rounded-xl focus:outline-none ${
            userIdError ? "border-[#B3261E]" : "border-gray-300"
          }`}
        />
        {userIdError && (
          <p className="text-xs text-[#B3261E] pl-2 mb-4">{userIdError}</p>
        )}

        <label className="pl-2 text-sm">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          className={`w-full px-4 h-8 py-2 border rounded-xl focus:outline-none ${
            passwordError ? "border-[#B3261E]" : "border-gray-300"
          }`}
        />
        {passwordError && (
          <p className="text-xs text-[#B3261E] pl-2 mb-4">{passwordError}</p>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2.5 mt-8 font-bold rounded-xl ${
            isFormValid ? "bg-black text-white" : "bg-[#F4F4F4] text-gray-400"
          }`}
        >
          로그인
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        계정이 없다면 <Link to="/signup" className="text-black">회원가입 →</Link>
      </p>
    </div>
  );
}

export default Login;
