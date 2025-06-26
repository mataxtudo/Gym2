import { Route, Routes } from "react-router-dom";
import LoginScreen from "../Pages/LoginScreen";
import Home from "../Pages/Home";
import Cadastro from "../Pages/CadastroUsuarios";
import AtualizarUsuario from "../Pages/AtualizarUsuario";
import ListagemClientes from "../Pages/CadastroCliente";
import ListaPlanos from "../Pages/ListaPlanos";
import ListaReceitas from "../Pages/ListaReceitas";
import ListaDespesas from "../Pages/ListaDespesas";
import FichaDeTreinoForm from "../Pages/FichaDeTreinoForm";  // verifique se existe e caminho está correto
import ListaDeEquipamentos from "../Pages/ListaDeEquipamentos";

function Financeiro() {
  return <div>Financeiro em construção</div>;
}

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/AtualizarUsuario" element={<AtualizarUsuario />} />
      <Route path="/Clientes" element={<ListagemClientes />} />
      <Route path="/Planos" element={<ListaPlanos />} />
      <Route path="/Financeiro/Receitas" element={<ListaReceitas />} />
      <Route path="/Financeiro/Despesas" element={<ListaDespesas />} />
      <Route path="/Equipamentos" element={<ListaEquipamentos />} />
      <Route path="/FichasTreino" element={<FichaDeTreinoForm />} />
      <Route path="/Financeiro/Resumo" element={<Financeiro />} />
    </Routes>
  );
}

export default RoutesApp;
