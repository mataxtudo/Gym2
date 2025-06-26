import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Alert,
  AlertIcon,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import Sidebar from '../Componentes/Siderbar';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

export default function FichaDeTreinoForm() {
  const [aluno, setAluno] = useState('');
  const [professor, setProfessor] = useState('');
  const [tipoTreino, setTipoTreino] = useState('');
  const [equipamentos, setEquipamentos] = useState([]);

  const [erros, setErros] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [equipamentoNome, setEquipamentoNome] = useState('');
  const [repeticoes, setRepeticoes] = useState('');

  const toast = useToast();

  const bgCard = useColorModeValue('white', 'gray.800');
  const bgContainer = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Validação do formulário principal
  const validarFormulario = () => {
    const errosTemp = {};
    if (!aluno) errosTemp.aluno = 'Nome do aluno é obrigatório';
    if (!professor) errosTemp.professor = 'Nome do professor é obrigatório';
    if (!tipoTreino) errosTemp.tipoTreino = 'Selecione o tipo de treino';
    if (equipamentos.length === 0)
      errosTemp.equipamentos = 'Adicione pelo menos um equipamento';

    setErros(errosTemp);
    return Object.keys(errosTemp).length === 0;
  };

  // Validação do modal de equipamento
  const validarEquipamento = () => {
    return equipamentoNome.trim() !== '' && repeticoes.trim() !== '';
  };

  const handleAdicionarEquipamento = () => {
    if (!validarEquipamento()) {
      toast({
        title: 'Erro',
        description: 'Preencha o nome do equipamento e as repetições',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setEquipamentos((prev) => [
      ...prev,
      { nomeEquipamento: equipamentoNome.trim(), repeticoes: repeticoes.trim() },
    ]);
    setEquipamentoNome('');
    setRepeticoes('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast({
        title: 'Erro no formulário',
        description: 'Preencha todos os campos obrigatórios e adicione equipamentos',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post('/api/fichas', {
        aluno: { login: aluno },
        professor: { login: professor },
        tipoTreino,
        equipamentos: equipamentos.map((e) => ({
          equipamento: { nome: e.nomeEquipamento },
          repeticoes: e.repeticoes,
        })),
      });

      toast({
        title: 'Sucesso',
        description: 'Ficha de treino cadastrada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Resetar form
      setAluno('');
      setProfessor('');
      setTipoTreino('');
      setEquipamentos([]);
      setErros({});
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro',
        description: 'Falha ao cadastrar ficha de treino',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh">
      <Sidebar />

      <Flex flex="1" bg={bgContainer} align="center" justify="center" px={4}>
        <Box
          w="full"
          maxW="600px"
          bg={bgCard}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px solid"
          borderColor={borderColor}
          p={[6, 8, 10]}
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg">Cadastro de Ficha de Treino</Heading>
              <Text color="gray.500" fontSize="md" mt={2}>
                Preencha as informações da ficha
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isInvalid={!!erros.aluno} isRequired>
                  <FormLabel>Nome do Aluno</FormLabel>
                  <Input
                    placeholder="Ex: joao123"
                    value={aluno}
                    onChange={(e) => setAluno(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                  {erros.aluno && (
                    <Text color="red.500" fontSize="sm">
                      {erros.aluno}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!erros.professor} isRequired>
                  <FormLabel>Nome do Professor</FormLabel>
                  <Input
                    placeholder="Ex: profmaria"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                  {erros.professor && (
                    <Text color="red.500" fontSize="sm">
                      {erros.professor}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!erros.tipoTreino} isRequired>
                  <FormLabel>Tipo de Treino</FormLabel>
                  <Select
                    placeholder="Selecione o tipo"
                    value={tipoTreino}
                    onChange={(e) => setTipoTreino(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((tipo) => (
                      <option key={tipo} value={tipo}>
                        Treino {tipo}
                      </option>
                    ))}
                  </Select>
                  {erros.tipoTreino && (
                    <Text color="red.500" fontSize="sm">
                      {erros.tipoTreino}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!erros.equipamentos}>
                  <FormLabel>Equipamentos</FormLabel>
                  {equipamentos.length === 0 ? (
                    <Text color="gray.500">Nenhum equipamento adicionado.</Text>
                  ) : (
                    equipamentos.map((e, i) => (
                      <Text key={i}>
                        {e.nomeEquipamento} - {e.repeticoes} repetições
                      </Text>
                    ))
                  )}
                  {erros.equipamentos && (
                    <Text color="red.500" fontSize="sm">
                      {erros.equipamentos}
                    </Text>
                  )}
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    mt={2}
                    onClick={onOpen}
                  >
                    Adicionar Equipamento
                  </Button>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
                >
                  Cadastrar Ficha
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Flex>

      {/* Modal de Equipamento */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Equipamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Nome do Equipamento</FormLabel>
              <Input
                placeholder="Ex: Supino reto"
                value={equipamentoNome}
                onChange={(e) => setEquipamentoNome(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Repetições</FormLabel>
              <Input
                placeholder="Ex: 12"
                type="number"
                value={repeticoes}
                onChange={(e) => setRepeticoes(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAdicionarEquipamento}>
              Adicionar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
