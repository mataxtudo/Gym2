import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import Sidebar from '../Componentes/Siderbar';
import { useDespesas } from '../Contexts/DespesaContext';
import axios from 'axios';

export default function Financeiro() {
  const { cadastrarDespesa } = useDespesas();

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const [saldo, setSaldo] = useState(null);

  const bgCard = useColorModeValue('white', 'gray.800');
  const bgContainer = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const validar = () => {
    const erros = {};
    if (!descricao) erros.descricao = 'Descrição obrigatória';
    if (!valor || isNaN(valor) || Number(valor) <= 0)
      erros.valor = 'Informe um valor válido maior que zero';
    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(false);

    if (!validar()) {
      setError(true);
      return;
    }

    try {
      await cadastrarDespesa({
        descricao,
        vlTotal: parseFloat(valor),
      });

      setFormSubmitted(true);
      setError(false);
      setDescricao('');
      setValor('');
      carregarSaldo();
    } catch (err) {
      setError(true);
      console.error(err.message);
    }
  };

  const carregarSaldo = async () => {
    try {
      const response = await axios.get('/api/movimentacao/saldo');
      setSaldo(response.data);
    } catch (err) {
      console.error('Erro ao carregar saldo:', err);
    }
  };

  useEffect(() => {
    carregarSaldo();
  }, []);

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
              <Heading size="lg">Financeiro</Heading>
              <Text color="gray.500" fontSize="md" mt={2}>
                Registre despesas e acompanhe o saldo atual
              </Text>
            </Box>

            <Divider />

            {saldo && (
              <Alert status="info" rounded="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Saldo Atual</AlertTitle>
                  <AlertDescription>
                    R$ {saldo.saldo?.toFixed(2).replace('.', ',')}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {error && (
              <Alert status="error" rounded="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Erro!</AlertTitle>
                  <AlertDescription>
                    Verifique os campos e tente novamente.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {formSubmitted && (
              <Alert status="success" rounded="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Despesa Registrada!</AlertTitle>
                  <AlertDescription>
                    A despesa foi salva com sucesso.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired isInvalid={!!errors.descricao}>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    placeholder="Ex: Conta de luz"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    size="lg"
                  />
                  <FormErrorMessage>{errors.descricao}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.valor}>
                  <FormLabel>Valor Total (R$)</FormLabel>
                  <Input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    size="lg"
                  />
                  <FormErrorMessage>{errors.valor}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
                >
                  Salvar Despesa
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
