import React, { useState, useEffect } from 'react';
import css from "../styles/WelcomeScreen.module.css";
import ConfigurationMode from './ConfigurationMode';  // Импорт экрана конфигурации

const WelcomeScreen = () => {
  const [showConfigurationScreen, setShowConfigurationScreen] = useState(false);

  // Обработчик нажатия пробела для перехода на экран конфигурации
  const handleKeyDown = (event) => {
    if (event.key === "Spacebar") {  // Пробел
      event.preventDefault();  // Останавливает прокрутку страницы
      setShowConfigurationScreen(true);  // Переход на экран конфигурации
    }
  };

  // Добавляем обработчик события для нажатия клавиши
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      {!showConfigurationScreen ? (
        <div className={css.welcomeContainer}>
          <h1>Welcome to the Quiz Game!</h1>
          <p>Press SPACE to start configuring your game</p>
        </div>
      ) : (
        <ConfigurationMode />  // Переход на экран конфигурации
      )}
    </div>
  );
};

export default WelcomeScreen;
