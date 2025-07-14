import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
        navigate("/"); // 메인화면으로 이동
      } else {
        alert(data.error || "로그인 실패");
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      alert("서버 오류");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-extrabold mb-20">로그인</h1>

      <form onSubmit={handleSubmit} className="w-90 flex flex-col gap-2">
        <label className="pl-2 text-sm">아이디</label>
        <input
          type="text"
          placeholder="영문, 숫자, 특수문자 입력 가능"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full h-8 px-4 py-2 mb-5 border border-gray-300 rounded-xl focus:outline-none"
        />

        <label className="pl-2 text-sm">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 h-8 py-2 border border-gray-300 rounded-xl focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2.5 mt-8 rounded-xl"
        >
          로그인
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        계정이 없다면{" "}
        <Link to="/signup" className="text-black">
          회원가입 →
        </Link>
      </p>
    </div>
  );
}

export default Login;
