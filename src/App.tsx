import './App.css';
import { BoardProvider } from './contexts/BoardContext/BoardContext';
import { SearchProvider } from './contexts/SearchContext/SearchContext';
import { MainRouter } from './routes/MainRouter/MainRouter';

function App() {
  return (
    <BoardProvider>
      <SearchProvider>
        <MainRouter />
      </SearchProvider>
    </BoardProvider>
  );
}

export default App;

// salvar as possiveis acoes que podem ocorrer
// ter uma funcao com switch case pra cada acao
// ai voce exporta um componente provedor, ou seja um provider.
// const [state, setState] = useState(parametro inicial do estado)

// setState(acao que vai acontecer com o estado, tipo, state + 1, nao e possivel atribuicao direta com state, exemplo state=)
// essa e a forma de atribuicao direta de estado

// com reducer voce evita ficar colocando logicas de alteração e tudo, deixando o codigo extremamente extenso e verboso
// ai voce basicamente define
// type actions = {
//   {type: 'acrescentar', payload: number} | {type: 'reduzir', payload: number}
// }
// function slaReducer(state, action: actions){
//   switch(action.type){
//     case 'acrescentar':
//       return
//     case 'reduzir':
//       return
//   }
// }

// export function slaProvider({children}: React.ReactNode){
//   const [state, dispatch] = useReducer(slaReducer);

//   return (
//     <slaContext.Provider value={{state, dispatch}}>{children}</slaContext.Provider>
//   )
// }
