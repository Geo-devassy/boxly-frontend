// SessionTimeout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SessionTimeout({ timeout = 10 * 60 * 1000 }) { 
  

  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        alert("Session expired due to inactivity!");
        localStorage.clear(); // remove role + token
        navigate("/");
      }, timeout);
    };

    // Events that reset session
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // start timer

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate, timeout]);

  return null;
}

export default SessionTimeout;