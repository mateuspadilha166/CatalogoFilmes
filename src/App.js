import React, { useState } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const adicionarFilme = async () => {
    setCarregando(true);
    setErro('');
    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${query}&apikey=96dc08e7`);
      const filme = response.data;

      if (filme.Response === 'True') {
        const novoFilme = {
          titulo: filme.Title,
          ano: filme.Year,
          imagem: filme.Poster
        };
        setFilmes((prevFilmes) => [...prevFilmes, novoFilme]);
      } else {
        throw new Error(filme.Error);
      }
    } catch (error) {
      console.error("Erro ao buscar", error);
      setErro("Não foi possível buscar o filme.");
    } finally {
      setCarregando(false);
    }
  };

  const removerFilme = (index) => {
    setFilmes((prevFilmes) => prevFilmes.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="Titulo1">Filme</h1>
      <input
        className="input"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Digite o nome do filme"
      />
      <button onClick={adicionarFilme} disabled={carregando} className="button1">
        {carregando ? 'Carregando...' : 'Adicionar Filme'}
      </button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <ul className="listaFilme">
        {filmes.map((filme, index) => (
          <li key={index}>
            <img src={filme.imagem} alt={`Poster de ${filme.titulo}`} className="img"/><br/>
            <strong>{filme.titulo} ({filme.ano})</strong>
            <button onClick={() => removerFilme(index)} className="removerBotao">Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
