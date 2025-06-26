import React, { useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Heading,
  SimpleGrid,
  Divider,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { usePlanoCliente } from "../Contexts/PlanoClienteContext";

const formatarData = (dataISO) => {
  if (!dataISO) return "-";
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const DetalhesCliente = ({ cliente }) => {
  const {
    planoCliente,
    buscarPlanosPorCliente,
    loadingPlanoCliente,
  } = usePlanoCliente();

  // Busca plano do cliente toda vez que o cliente mudar
  useEffect(() => {
    if (cliente?.id) {
      buscarPlanosPorCliente(cliente.id);
    }
  }, [cliente]);

  const bgBox = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!cliente) return null;

  return (
    <Box
      bg={bgBox}
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      boxShadow="md"
      p={6}
      maxW="600px"
      mx="auto"
    >
      <Heading size="md" mb={4} textAlign="center" color="teal.600">
        Detalhes do Cliente
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        <Box>
          <Stack spacing={2}>
            <Text><b>ID:</b> {cliente.id}</Text>
            <Text><b>Nome:</b> {cliente.nome}</Text>
            <Text><b>Email:</b> {cliente.email || "-"}</Text>
            <Text><b>Telefone:</b> {cliente.telefone || "-"}</Text>
            <Text><b>CPF:</b> {cliente.cpf || "-"}</Text>
          </Stack>
        </Box>

        <Box>
          <Stack spacing={2}>
            <Text><b>Data de Nascimento:</b> {formatarData(cliente.dtNascimento)}</Text>
            <Text><b>Endereço:</b> {cliente.endereco || "-"}</Text>
            <Text><b>CEP:</b> {cliente.cep || "-"}</Text>
          </Stack>
        </Box>
      </SimpleGrid>

      <Divider mb={4} />

      <Box>
        <Heading size="sm" mb={2} color="teal.500">
          Plano Atual
        </Heading>

        {loadingPlanoCliente ? (
          <Text>Carregando plano...</Text>
        ) : planoCliente ? (
          <Stack spacing={1}>
            <Text>
              <b>Plano:</b>{" "}
              <Badge colorScheme="purple" fontSize="0.9em">
                {planoCliente.nome || planoCliente.nomePlano || "Nome indisponível"}
              </Badge>
            </Text>
            <Text><b>Início:</b> {formatarData(planoCliente.dtInicio || planoCliente.dataInicio)}</Text>
            <Text><b>Término:</b> {formatarData(planoCliente.dtFim || planoCliente.dataFim)}</Text>
          </Stack>
        ) : (
          <Text color="gray.500" fontStyle="italic">
            Cliente não possui plano vinculado.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default DetalhesCliente;
