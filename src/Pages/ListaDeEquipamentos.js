import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import Sidebar from "../Componentes/Siderbar";
import EquipamentoFormModal from "../Componentes/EquipamentoFormModal";
import axios from "axios";

const ListaEquipamentos = () => {
  // Estados
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const [loading, setLoading] = useState(true);

  // Chakra UI hooks
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Equipamento selecionado para editar/cadastrar
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

  // Ao montar componente, lista equipamentos
  useEffect(() => {
    listarEquipamentos();
  }, []);

  // Função para listar equipamentos da API
  const listarEquipamentos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/equipamentos");
      setEquipamentos(response.data);
      setEquipamentosFiltrados(response.data);
    } catch (error) {
      console.error("Erro ao listar equipamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pesquisa equipamentos por nome
  const pesquisarEquipamentos = () => {
    if (!pesquisa.trim()) {
      setEquipamentosFiltrados(equipamentos);
      setPagina(1);
      return;
    }

    const filtrados = equipamentos.filter((e) =>
      e.nome?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    setEquipamentosFiltrados(filtrados);
    setPagina(1);
  };

  // Deleta equipamento por id
  const deletarEquipamento = async (id) => {
    try {
      await axios.delete(`/api/equipamentos/${id}`);
      listarEquipamentos();
    } catch (error) {
      console.error("Erro ao deletar equipamento:", error);
    }
  };

  // Abrir modal para editar
  const abrirModalEditar = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    onOpen();
  };

  // Abrir modal para novo cadastro
  const abrirModalCadastro = () => {
    setEquipamentoSelecionado(null);
    onOpen();
  };

  // Fechar modal e atualizar lista
  const fecharModal = () => {
    setEquipamentoSelecionado(null);
    onClose();
    listarEquipamentos();
  };

  // Paginação - próxima página
  const proximaPagina = () => {
    if (pagina * itensPorPagina < equipamentosFiltrados.length) {
      setPagina(pagina + 1);
    }
  };

  // Paginação - página anterior
  const paginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  // Calcular intervalo de itens para página atual
  const ultimoItem = pagina * itensPorPagina;
  const primeiroItem = ultimoItem - itensPorPagina;

  // Pega itens da página atual
  const equipamentosListados = equipamentosFiltrados.slice(
    primeiroItem,
    ultimoItem
  );

  return (
    <>
      <Sidebar />
      <Flex
        minH="100vh"
        justifyContent="center"
        pt={10}
        bg={colorMode === "light" ? "gray.100" : "gray.800"}
      >
        <Box w="80%" maxW="1000px">
          {/* Botão de cadastro */}
          <Flex justifyContent="flex-end" mb={4}>
            <Button colorScheme="teal" onClick={abrirModalCadastro}>
              Cadastrar Equipamento
            </Button>
          </Flex>

          {/* Barra de pesquisa e botões */}
          <Flex mb={6}>
            <Input
              placeholder="Pesquisar Equipamentos"
              size="lg"
              mr={4}
              flex="1"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") pesquisarEquipamentos();
              }}
            />
            <IconButton
              icon={<FiSearch />}
              aria-label="Pesquisar"
              colorScheme="blue"
              onClick={pesquisarEquipamentos}
            />
            <IconButton
              icon={<FiRefreshCw />}
              aria-label="Atualizar"
              colorScheme="green"
              ml={2}
              onClick={listarEquipamentos}
            />
          </Flex>

          {/* Conteúdo da lista ou loading */}
          {loading ? (
            <Box textAlign="center" mt={10}>
              <Spinner size="xl" />
            </Box>
          ) : (
            <Box
              overflowX="auto"
              borderRadius="md"
              borderWidth="1px"
              bg={colorMode === "light" ? "gray.50" : "gray.600"}
              p={4}
            >
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nome</Th>
                    <Th isNumeric>Carga (kg)</Th>
                    <Th>Cadastro</Th>
                    <Th>Últ. Manutenção</Th>
                    <Th>Próx. Manutenção</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {equipamentosListados.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={4}>
                        Nenhum equipamento encontrado.
                      </Td>
                    </Tr>
                  ) : (
                    equipamentosListados.map((e) => (
                      <Tr key={e.id}>
                        <Td>{e.id}</Td>
                        <Td>{e.nome}</Td>
                        <Td isNumeric>{Number(e.carga).toFixed(2)}</Td>
                        <Td>{e.dtCadastro}</Td>
                        <Td>{e.ultimaManutencao}</Td>
                        <Td>{e.proximaManutencao}</Td>
                        <Td>
                          <IconButton
                            size="sm"
                            colorScheme="green"
                            icon={<FiEdit2 />}
                            mr={2}
                            aria-label={`Editar equipamento ${e.nome}`}
                            onClick={() => abrirModalEditar(e)}
                          />
                          <IconButton
                            size="sm"
                            colorScheme="red"
                            icon={<FiTrash2 />}
                            aria-label={`Deletar equipamento ${e.nome}`}
                            onClick={() => deletarEquipamento(e.id)}
                          />
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>

              {/* Paginação */}
              <Flex mt={6} alignItems="center" justifyContent="space-between">
                <Button
                  onClick={paginaAnterior}
                  isDisabled={pagina === 1}
                  colorScheme="blue"
                  leftIcon={<FiArrowLeft />}
                >
                  Anterior
                </Button>

                <Text fontWeight="bold" fontSize="lg">
                  Página {pagina} de{" "}
                  {Math.ceil(equipamentosFiltrados.length / itensPorPagina)}
                </Text>

                <Button
                  onClick={proximaPagina}
                  isDisabled={
                    pagina * itensPorPagina >= equipamentosFiltrados.length
                  }
                  colorScheme="blue"
                  rightIcon={<FiArrowRight />}
                >
                  Próxima
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Modal para cadastro/edição */}
      <Modal isOpen={isOpen} onClose={fecharModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {equipamentoSelecionado
              ? "Editar Equipamento"
              : "Cadastrar Equipamento"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <EquipamentoFormModal
              equipamento={equipamentoSelecionado}
              onClose={fecharModal}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListaEquipamentos;
