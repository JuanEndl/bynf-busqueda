import './App.css'
import BusquedaComponentes from './components/BusquedaComponentes'
import logo from './assets/logo/Bynf.png'

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img src={logo} alt="Logo Bynf" className="w-50 h-auto"/>
        <h1 className="text-4xl font-black text-gray-900 dark:text-dark mx-20">Buscador Bynf</h1>
      </div>
      <BusquedaComponentes />
    </>
  )
}

export default App
