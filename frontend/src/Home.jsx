import { useState, useEffect } from "react";

export default function CharactersApp() {
  const [characters, setCharacters] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [realName, setRealName] = useState("");
  const [universe, setUniverse] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/characters")
      .then((res) => res.json())
      .then((data) => setCharacters(data));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();

    const exist = characters.some((c) => c.id === id);

    if (exist) {
      fetch(`http://localhost:3000/characters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, realName, universe }),
      })
        .then((res) => res.json())
        .then((updated) => {
          setCharacters(characters.map((c) => (c.id === id ? updated : c)));
          resetForm();
        });
    } else {
      fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, realName, universe }),
      })
        .then((res) => res.json())
        .then((newChar) => {
          setCharacters([...characters, newChar]);
          resetForm();
        });
    }
  };

  const handleDelete = (charId) => {
    fetch(`http://localhost:3000/characters/${charId}`, { method: "DELETE" })
      .then(() => {
        setCharacters(characters.filter((c) => c.id !== charId));
        setShowConfirm(false);
        setSelectedCharacter(null);
      });
  };

  const handleEdit = (char) => {
    setId(char.id);
    setName(char.name);
    setRealName(char.realName);
    setUniverse(char.universe);
  };

  const confirmDelete = (char) => {
    setSelectedCharacter(char);
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedCharacter(null);
  };

  const resetForm = () => {
    setId("");
    setName("");
    setRealName("");
    setUniverse("");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded shadow-md my-6 border">
      <h1 className="text-3xl font-bold text-center text-[#283044]">
        MCU Characters
      </h1>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#778da9]">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Real Name</th>
            <th className="border border-gray-300 px-4 py-2">Universe</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((c) => (
            <tr key={c.id}>
              <td className="border border-gray-300 px-4 py-2">{c.id}</td>
              <td className="border border-gray-300 px-4 py-2">{c.name}</td>
              <td className="border border-gray-300 px-4 py-2">{c.realName}</td>
              <td className="border border-gray-300 px-4 py-2">{c.universe}</td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  className="bg-[#415a77] text-white px-5 py-1 rounded"
                  onClick={() => handleEdit(c)}
                >
                  Modifier
                </button>
                <button
                  className="bg-[#415a77] text-white px-3 py-1 rounded"
                  onClick={() => confirmDelete(c)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAdd} className="mt-6 g-5 flex">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          className="border mx-2 px-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border mx-2 px-2 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          placeholder="Real Name"
          className="border mx-2 px-2 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={universe}
          onChange={(e) => setUniverse(e.target.value)}
          placeholder="Universe"
          className="border mx-2 px-2 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <button
          type="submit"
          className="bg-[#283044] text-white mx-auto px-4 py-2 rounded w-full"
        >
          Ajouter
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">
              Voulez-vous vraiment supprimer{" "}
              <span className="font-bold">{selectedCharacter?.name}</span> ?
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleDelete(selectedCharacter.id)}
                className="bg-[#778da9] text-white px-4 py-2 rounded"
              >
                Oui
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#283044] px-4 py-2 rounded"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
