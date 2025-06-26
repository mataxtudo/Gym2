import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorMode,
  Heading,
  VStack,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from '../Contexts/AuthContext';

const LoginScreen = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userLogin || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login({ login: userLogin, password });
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <Flex
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
    >
      <Box
        p={8}
        rounded="md"
        borderWidth="1px"
        boxShadow="lg"
        bg={colorMode === 'light' ? 'white' : 'gray.700'}
        w={['90%', '80%', '50%']}
        maxW="500px"
      >
        <VStack spacing={4}>
          <Heading as="h1" size="lg">Login</Heading>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Erro ao entrar</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form style={{ width: '100%' }} onSubmit={handleLogin}>
            <FormControl id="login" isRequired>
              <FormLabel fontSize={18}>Login</FormLabel>
              <Input
                type="text"
                value={userLogin}
                onChange={(e) => setUserLogin(e.target.value)}
                placeholder="Insira seu login"
                size="lg"
                variant="flushed"
              />
            </FormControl>

            <FormControl id="password" isRequired mt={5}>
              <FormLabel fontSize={18}>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha"
                size="lg"
                variant="flushed"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="100%"
              mt={6}
            >
              Entrar
            </Button>
          </form>

          <Button
            onClick={toggleColorMode}
            colorScheme={colorMode === 'light' ? 'blue' : 'gray'}
            variant="link"
          >
            {colorMode === 'light' ? 'Tema Escuro' : 'Tema Claro'}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginScreen;
