import { useEffect } from "react";

function SplashScreen({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div>
      <h1>Welcome to Show Mode!</h1>
      <p>Get ready...</p>
    </div>
  );
}

export default SplashScreen;
