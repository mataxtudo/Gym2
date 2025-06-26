
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import RoutesApp from './Routes/RoutesApp';
import { AuthProvider } from './Contexts/AuthContext';
import { RegisterProvider } from './Contexts/RegisterContext';
import { UpdateUserProvider } from './Contexts/UpdateUserContext';
import { ClienteProvider } from './Contexts/ClienteContext';
import { VendaProvider } from './Contexts/VendaContext';
import { PlanoProvider } from './Contexts/PlanoContext';
import { PlanoClienteProvider } from './Contexts/PlanoClienteContext';
import { ReceitaProvider } from './Contexts/ReceitaContext';
import { DespesaProvider } from './Contexts/DespesaContext';
import ListaDeEquipamentos from './Pages/ListaDeEquipamentos';
import Financeiro from './Pages/Financeiro';
import FichaDeTreino from './Pages/FichaDeTreino';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendaProvider>
          <PlanoProvider>
            <ClienteProvider>
              <PlanoClienteProvider>
                <ReceitaProvider>
                  <UpdateUserProvider>
                    <RegisterProvider>
                      <DespesaProvider>
                        <ChakraProvider>
                          <RoutesApp />
                        </ChakraProvider>
                      </DespesaProvider>
                    </RegisterProvider>
                  </UpdateUserProvider>
                </ReceitaProvider>
              </PlanoClienteProvider>
            </ClienteProvider>
          </PlanoProvider>
        </VendaProvider>
      </AuthProvider>

    </BrowserRouter >
  )
}
export default App;
