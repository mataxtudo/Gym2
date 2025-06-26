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
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import Sidebar from '../Componentes/Siderbar';
import { useRegister } from '../Contexts/RegisterContext';

export default function Cadastro() {
  const { register } = useRegister();

  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const bgCard = useColorModeValue('white', 'gray.800');
  const bgContainer = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !role) {
      setError(true);
      return;
    }

    try {
      await register({ login: name, password, role });
      setFormSubmitted(true);
      setError(false);
      setName('');
      setPassword('');
      setRole('');
    } catch (err) {
      setError(true);
      console.error(err.message);
    }
  };

  return (
    <Flex minH="100vh">
      <Sidebar />

      <Flex flex="1" bg={bgContainer} align="center" justify="center" px={4}>
        <Box
          w="full"
          maxW="500px"
          bg={bgCard}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px solid"
          borderColor={borderColor}
          p={[6, 8, 10]}
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg">Cadastro de Usuário</Heading>
              <Text color="gray.500" fontSize="md" mt={2}>
                Preencha as informações para cadastrar um novo usuário
              </Text>
            </Box>

            {error && (
              <Alert status="error" rounded="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Erro!</AlertTitle>
                  <AlertDescription>
                    Preencha todos os campos corretamente.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {formSubmitted && (
              <Alert status="success" rounded="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>
                    Usuário cadastrado com sucesso.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <Input
                    placeholder="Digite o nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Permissão</FormLabel>
                  <Select
                    placeholder="Selecione a permissão"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
                >
                  Cadastrar
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
