import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import css from "../styles/PlayersScreen.module.css";

function PlayersScreen({ onPlayers }) {
  const { players, setPlayers } = useContext(AppContext);

  const handleNextPlayer = (selectedPlayerId) => {
    const updatedPlayers = players.map((player) => ({
      ...player,
      isActive: player.id === selectedPlayerId,
    }));
    setPlayers(updatedPlayers);
    onPlayers();
  };

  if (!players || players.length === 0) {
    return <p>No players available. Please configure players first.</p>;
  }

  return (
    <div className={css.playersScreen}>
      <h2>Players Screen</h2>
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className={player.isActive ? css.activePlayer : css.player}
          >
            <strong>{player.name}</strong>: {player.points} points
            <button
              onClick={() => handleNextPlayer(player.id)}
              disabled={player.isActive}
              className={player.isActive ? css.disabledButton : ""}
              aria-label={`Select ${player.name}`}
            >
              {player.isActive ? "Active" : "Select"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersScreen;
