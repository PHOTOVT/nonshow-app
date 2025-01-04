import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function PlayersScreen({ onSelection }) {
  const { players, setPlayers } = useContext(AppContext);

  const handleNextPlayer = (selectedPlayerId) => {
    const updatedPlayers = players.map((player) => ({
      ...player,
      isActive: player.id === selectedPlayerId,
    }));
    setPlayers(updatedPlayers);
    onSelection();
  };

  return (
    <div>
      <h2>Players Screen</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <strong>{player.name}</strong>: {player.points} points
            <button onClick={() => handleNextPlayer(player.id)}>Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersScreen;
