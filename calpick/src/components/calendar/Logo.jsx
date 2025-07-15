import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';  // 로고 이미지 경로 조정

export default function Logo() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/');
    } else { 
      navigate('/login');
    }
  };

  return (
    <img
      src={logo}
      alt="Logo"
      className="h-7 cursor-pointer"
      onClick={handleClick}
    />
  );
}
