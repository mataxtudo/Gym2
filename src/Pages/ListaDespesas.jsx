import React, { useState, useEffect } from "react";
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
  FiDownload,
  FiXCircle,
} from "react-icons/fi";
import { useDespesas } from "../Contexts/DespesaContext";
import Sidebar from "../Componentes/Siderbar";
import DespesaFormModal from "../Componentes/DespesaFormModal";

const ListaDespesas = () => {
  const {
    despesas,
    loading,
    listarDespesas,
    deletarDespesa,
    baixarDespesa,
    removerBaixa,
  } = useDespesas();

  const [despesasFiltradas, setDespesasFiltradas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina] = useState(10);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);

  useEffect(() => {
    setDespesasFiltradas(despesas);
  }, [despesas]);

  const pesquisarDespesas = () => {
    if (!pesquisa) {
      setDespesasFiltradas(despesas);
      setPagina(1);
      return;
    }
    const filtrados = despesas.filter((d) =>
      d.descricao?.toLowerCase().includes(pesquisa.toLowerCase())
    );
    setDespesasFiltradas(filtrados);
    setPagina(1);
  };

  const proximaPagina = () => {
    if (pagina * itensPorPagina < despesasFiltradas.length) {
      setPagina(pagina + 1);
    }
  };

  const paginaAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  const ultimoItem = pagina * itensPorPagina;
  const primeiroItem = ultimoItem - itensPorPagina;
  const despesasListadas = despesasFiltradas.slice(primeiroItem, ultimoItem);

  const abrirModalEditar = (despesa) => {
    setDespesaSelecionada(despesa);
    onOpen();
  };

  const abrirModalCadastro = () => {
    setDespesaSelecionada(null);
    onOpen();
  };

  const fecharModal = () => {
    setDespesaSelecionada(null);
    onClose();
  };

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
          <Flex justifyContent="flex-end" mb={2}>
            <Button colorScheme="teal" onClick={abrirModalCadastro}>
              Cadastrar Despesa
            </Button>
          </Flex>

          <Flex mb={4}>
            <Input
              placeholder="Pesquisar Despesas"
              size="lg"
              mr={4}
              flex="1"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <IconButton
              icon={<FiSearch />}
              aria-label="Pesquisar"
              colorScheme="blue"
              onClick={pesquisarDespesas}
            />
            <IconButton
              icon={<FiRefreshCw />}
              aria-label="Atualizar"
              colorScheme="green"
              ml={2}
              onClick={listarDespesas}
            />
          </Flex>

          {loading ? (
            <Box textAlign="center" mt={10}>
              <Spinner size="xl" />
            </Box>
          ) : (
            <Box
              overflow="auto"
              borderRadius="md"
              borderWidth="1px"
              bg={colorMode === "light" ? "gray.50" : "gray.600"}
              p={4}
            >
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Descrição</Th>
                    <Th>Valor</Th>
                    <Th>Baixado</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {despesasListadas.map((despesa) => (
                    <Tr key={despesa.id}>
                      <Td>{despesa.id}</Td>
                      <Td>{despesa.descricao}</Td>
                      <Td>R$ {Number(despesa.vlTotal).toFixed(2)}</Td>
                      <Td>{despesa.stBaixado ? "Sim" : "Não"}</Td>
                      <Td>
                        <IconButton
                          size="sm"
                          colorScheme="green"
                          aria-label="Editar Despesa"
                          icon={<FiEdit2 />}
                          mr={2}
                          onClick={() => abrirModalEditar(despesa)}
                        />
                        {despesa.stBaixado ? (
                          <IconButton
                            size="sm"
                            colorScheme="yellow"
                            aria-label="Remover Baixa"
                            icon={<FiXCircle />}
                            mr={2}
                            onClick={() => removerBaixa(despesa.id)}
                          />
                        ) : (
                          <IconButton
                            size="sm"
                            colorScheme="blue"
                            aria-label="Baixar Despesa"
                            icon={<FiDownload />}
                            mr={2}
                            onClick={() => baixarDespesa(despesa.id)}
                          />
                        )}
                        <IconButton
                          size="sm"
                          colorScheme="red"
                          aria-label="Deletar Despesa"
                          icon={<FiTrash2 />}
                          onClick={() => deletarDespesa(despesa.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Flex mt={4} alignItems="center" justifyContent="space-between">
                <Button
                  onClick={paginaAnterior}
                  isDisabled={pagina === 1}
                  colorScheme="blue"
                >
                  <FiArrowLeft />
                </Button>

                <Text fontWeight="bold" fontSize="lg">
                  Página {pagina}
                </Text>

                <Button
                  onClick={proximaPagina}
                  isDisabled={
                    pagina * itensPorPagina >= despesasFiltradas.length
                  }
                  colorScheme="blue"
                >
                  <FiArrowRight />
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={fecharModal}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {despesaSelecionada ? "Editar Despesa" : "Cadastrar Despesa"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <DespesaFormModal despesa={despesaSelecionada} onClose={fecharModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListaDespesas;
