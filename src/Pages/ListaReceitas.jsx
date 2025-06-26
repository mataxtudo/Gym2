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
import { useReceita } from "../Contexts/ReceitaContext";
import Sidebar from "../Componentes/Siderbar";
import ReceitaFormModal from "../Componentes/ReceitaFormModal";

const ListaReceitas = () => {
  const {
    receitas,
    loading,
    listarReceitas,
    deletarReceita,
    baixarReceita,
    removerBaixa,
  } = useReceita();

  const [receitasFiltradas, setReceitasFiltradas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [pagina, setPagina] = useState(1);
  const [receitasPorPagina] = useState(10);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  useEffect(() => {
    setReceitasFiltradas(receitas);
  }, [receitas]);

  const pesquisarReceitas = () => {
    if (!pesquisa) {
      setReceitasFiltradas(receitas);
      setPagina(1);
      return;
    }
    const filtrados = receitas.filter((r) =>
      r.descricao?.toLowerCase().includes(pesquisa.toLowerCase())
    );
    setReceitasFiltradas(filtrados);
    setPagina(1);
  };

  const proximaPagina = () => {
    if (pagina * receitasPorPagina < receitasFiltradas.length) {
      setPagina(pagina + 1);
    }
  };

  const paginaAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  const ultimoItem = pagina * receitasPorPagina;
  const primeiroItem = ultimoItem - receitasPorPagina;
  const receitasListadas = receitasFiltradas.slice(primeiroItem, ultimoItem);

  const abrirModalEditar = (receita) => {
    setReceitaSelecionada(receita);
    onOpen();
  };

  const abrirModalCadastro = () => {
    setReceitaSelecionada(null);
    onOpen();
  };

  const fecharModal = () => {
    setReceitaSelecionada(null);
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
              Cadastrar Receita
            </Button>
          </Flex>

          <Flex mb={4}>
            <Input
              placeholder="Pesquisar Receitas"
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
              onClick={pesquisarReceitas}
            />
            <IconButton
              icon={<FiRefreshCw />}
              aria-label="Atualizar"
              colorScheme="green"
              ml={2}
              onClick={listarReceitas}
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
                  {receitasListadas.map((receita) => (
                    <Tr key={receita.id}>
                      <Td>{receita.id}</Td>
                      <Td>{receita.descricao}</Td>
                      <Td>R$ {Number(receita.vlTotal).toFixed(2)}</Td>
                      <Td>{receita.stBaixado ? "Sim" : "Não"}</Td>
                      <Td>
                        <IconButton
                          size="sm"
                          colorScheme="green"
                          aria-label="Editar Receita"
                          icon={<FiEdit2 />}
                          mr={2}
                          onClick={() => abrirModalEditar(receita)}
                        />
                        {receita.stBaixado ? (
                          <IconButton
                            size="sm"
                            colorScheme="yellow"
                            aria-label="Remover Baixa"
                            icon={<FiXCircle />}
                            mr={2}
                            onClick={() => removerBaixa(receita.id)}
                          />
                        ) : (
                          <IconButton
                            size="sm"
                            colorScheme="blue"
                            aria-label="Baixar Receita"
                            icon={<FiDownload />}
                            mr={2}
                            onClick={() => baixarReceita(receita.id)}
                          />
                        )}
                        <IconButton
                          size="sm"
                          colorScheme="red"
                          aria-label="Deletar Receita"
                          icon={<FiTrash2 />}
                          onClick={() => deletarReceita(receita.id)}
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
                    pagina * receitasPorPagina >= receitasFiltradas.length
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
            {receitaSelecionada ? "Editar Receita" : "Cadastrar Receita"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <ReceitaFormModal receita={receitaSelecionada} onClose={fecharModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListaReceitas;
