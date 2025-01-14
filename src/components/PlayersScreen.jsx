import { useContext } from "react";
import { AppContext } from "../context/AppContext";

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
    return <h3>No players available. Please configure players first</h3>;
  }

  return (
    <div>
      <h2>Players Screen</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <h3>
              {player.name}: {player.points} points
            </h3>
            <button
              onClick={() => handleNextPlayer(player.id)}
              disabled={player.isActive}
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
