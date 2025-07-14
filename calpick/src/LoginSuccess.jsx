import { useLocation, useNavigate } from "react-router-dom";

function LoginSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId || "아이디 없음";
  const password = location.state?.password || "";

  const handleStart = async () => {
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
        navigate("/"); // 캘린더 화면으로 이동
      } else {
        alert(data.error || "자동 로그인 실패");
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      alert("서버 오류");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-black mb-10">회원가입 완료!</h1>

      <p className="font-semibold">
        아이디: <span className="font-bold">{userId}</span>
      </p>

      <p className="m-10">캘픽이 빠르게 약속을 잡아드릴게요.</p>

      <button
        onClick={handleStart}
        className="w-70 py-2 bg-black text-white font-bold rounded-xl"
      >
        시작하기
      </button>
    </div>
  );
}

export default LoginSuccess;
