import { Component } from "react";
import axios from 'axios';// utilizado para pesquisas em HTTPS/htpp
import { queries } from "@testing-library/react";

class App extends Component{
  constructor(props){// constructor para pegar toda a classe de props
    super(props);
    this.state = {//meu State que vai armazenar o estado inicial das minhas variaveis
      filmes: [],//um array para armazenar meus filmes
      carregando: false,// aguardando resposta da API 
      erro: '',// caso ocorra um erro, ele ira me retornar
      query: ''
    };
  }//--------------------------------------------
  handleInputChange = (event) =>{
    this.setState({query: event.target.value});
  }
adicionarFilme = async () =>{// metodo assincrono, ou seja, esta aguardando uma resposta da API
  this.setState({carregando: true, erro: ''});
  try{
    const {query} = this.state;// ID que estou buscando (nome)
    const response = await axios.get(`http://www.omdbapi.com/?t=${query}&apikey=96dc08e7`);// faz uma busca na API utilizando um nome ou um ID do filme
    const filme = response.data;//Contem os dados do meu filme procurado
    //--------------------------------------
    //Checar a resposta de busca da API
    if(filme.Response === "True"){
      const novoFilme = {// se o filme foi encontrado, cria um novo objeto
        titulo: filme.Title,
        ano: filme.Year,
        imagem: filme.Poster
      };
      //------------------------------------------
      this.setState((prevState) =>({
        filmes: [...prevState.filmes, novoFilme],//Utiliza o prevState para adicionar um novo filme ao array
        carregando: false //e remove o carregamento  
      }));
    } else {
      throw new Error(filme.Error);
    }
  }catch (error){
      console.error('erro ao buscar', error);
      this.setState({
        erro: 'não foi possivel buscar o filme',
        carregando: false 
      });
    }
  }

  removerFilme = (index) =>{
    this.setState((prevState) =>({
    filmes: prevState.filmes.filter((_, i) => i!== index)
    }))
  }
  render(){
    const {filmes, carregando, erro, query } = this.state;
     return (
      <div >
      <h1>filme</h1>
      <input type="text"
      value={query}
      onChange={this.handleInputChange}
      placeholder="Digite o seu filme"
      />
      <button onClick={this.adicionarFilme} disabled={carregando}>{carregando ? 'carregando...' : 'Adicionar Filme'}</button>
      {erro && <p style={{color: 'red'}}>{erro}</p>}
      <ul>
  {filmes.length > 0 ? (
    filmes.map((filme, index) => (
      <li key={index}>
        <strong>{filme.titulo} {filme.ano}</strong>
        <button onClick={() => this.removerFilme(index)}>Remover</button>
        <img src={filme.imagem}/>
      </li>
    ))
  ) : (
    <li>Não há filmes para exibir</li> 
  )}
</ul>
      </div>
    );
  }
};


export default App;
