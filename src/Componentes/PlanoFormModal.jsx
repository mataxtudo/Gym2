import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { usePlano } from "../Contexts/PlanoContext";

const PlanoFormModal = ({ plano, onClose }) => {
  const { cadastrarPlano, atualizarPlano } = usePlano();
  const toast = useToast();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    valor: "",
    duracao: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (plano) {
      setForm({
        nome: plano.nome || "",
        descricao: plano.descricao || "",
        valor: plano.valor || "",
        duracao: plano.duracao || "",
      });
    } else {
      setForm({
        nome: "",
        descricao: "",
        valor: "",
        duracao: "",
      });
    }
  }, [plano]);

  const validar = () => {
    const novosErros = {};
    if (!form.nome) novosErros.nome = "Nome é obrigatório";
    if (!form.descricao) novosErros.descricao = "Descrição é obrigatória";
    if (!form.valor) novosErros.valor = "Valor é obrigatório";
    if (!form.duracao) novosErros.duracao = "Duração é obrigatória";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validar()) {
    toast({
      title: "Erro de validação",
      description: "Preencha todos os campos obrigatórios.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return;
  }

  try {
    if (plano?.id) {
      await atualizarPlano(plano.id, form);
      toast({
        title: "Plano atualizado",
        description: "Plano atualizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      await cadastrarPlano(form);
      toast({
        title: "Plano cadastrado",
        description: "Plano cadastrado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  } catch (error) {
    console.error("Erro no cadastro/atualização:", error);
    toast({
      title: "Erro no cadastro/atualização",
      description: error.message,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};

  return (
    <VStack spacing={4}>
      <FormControl isInvalid={!!erros.nome}>
        <FormLabel>Nome do Plano</FormLabel>
        <Input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Plano Mensal"
        />
        <FormErrorMessage>{erros.nome}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.descricao}>
        <FormLabel>Descrição</FormLabel>
        <Input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição do plano"
        />
        <FormErrorMessage>{erros.descricao}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.valor}>
        <FormLabel>Valor (R$)</FormLabel>
        <Input
          name="valor"
          type="number"
          value={form.valor}
          onChange={handleChange}
          placeholder="Ex: 99.90"
        />
        <FormErrorMessage>{erros.valor}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.duracao}>
        <FormLabel>Duração (em dias)</FormLabel>
        <Input
          name="duracao"
          type="number"
          value={form.duracao}
          onChange={handleChange}
          placeholder="Ex: 30"
        />
        <FormErrorMessage>{erros.duracao}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="teal" w="full" onClick={handleSubmit}>
        {plano ? "Atualizar Plano" : "Salvar Plano"}
      </Button>
    </VStack>
  );
};

export default PlanoFormModal;
