import { useState, useEffect } from "react";

export default function CharactersApp() {
  const [characters, setCharacters] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [realName, setRealName] = useState("");
  const [universe, setUniverse] = useState("");


  useEffect(() => {
    fetch("http://localhost:3000/characters")
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);


  const handleAdd = (e) => {
    e.preventDefault();

    const exist = characters.some(c => c.id === id);

    if (exist) {
      fetch(`http://localhost:3000/characters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, realName, universe })
      })
        .then(res => res.json())
        .then(updated => {
          setCharacters(characters.map(c => c.id === id ? updated : c));
          resetForm();
        });
    } else {
      fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, realName, universe })
      })
        .then(res => res.json())
        .then(newChar => {
          setCharacters([...characters, newChar]);
          resetForm();
        });
    }
  };

  const handleDelete = (charId) => {
    fetch(`http://localhost:3000/characters/${charId}`, { method: "DELETE" })
      .then(() => setCharacters(characters.filter(c => c.id !== charId)));
  };

  const handleEdit = (char) => {
    setId(char.id);
    setName(char.name);
    setRealName(char.realName);
    setUniverse(char.universe);
  };

  const resetForm = () => {
    setId("");
    setName("");
    setRealName("");
    setUniverse("");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded shadow-md my-6 border">
      <h1 className="text-3xl font-bold text-center text-[#283044]">MCU Characters</h1>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#ebf2fa]">
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
                  className="bg-[#78a1bb] text-white px-5 py-1 rounded"
                  onClick={() => handleEdit(c)}
                >
                  Modifier
                </button>
                <button
                  className="bg-[#78a1bb] text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(c.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAdd} className="mt-6 space-y-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          className="border px-2 py-1 rounded w-full
             focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border px-2 py-1 rounded w-full
             focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          placeholder="Real Name"
          className="border px-2 py-1 rounded w-full
             focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <input
          value={universe}
          onChange={(e) => setUniverse(e.target.value)}
          placeholder="Universe"
          className="border px-2 py-1 rounded w-full
             focus:outline-none focus:ring-2 focus:ring-[#78a1bb]"
        />
        <button
          type="submit"
          className="bg-[#283044] text-white px-4 py-2 rounded w-full"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
