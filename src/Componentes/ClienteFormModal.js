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
import { useClientes } from "../Contexts/ClienteContext"; // Corrigido o caminho do import

const CadastroCliente = ({ cliente, onClose }) => {
  const { cadastrarCliente, atualizarCliente } = useClientes();
  const toast = useToast();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    dtNascimento: "",
    endereco: "",
    cep: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        email: cliente.email || "",
        cpf: cliente.cpf || "",
        dtNascimento: cliente.dtNascimento || "",
        endereco: cliente.endereco || "",
        cep: cliente.cep || "",
      });
    } else {
      setForm({
        nome: "",
        email: "",
        cpf: "",
        dtNascimento: "",
        endereco: "",
        cep: "",
      });
    }
  }, [cliente]);

  const validar = () => {
    const novosErros = {};
    if (!form.nome) novosErros.nome = "Nome é obrigatório";
    if (!form.email) novosErros.email = "Email é obrigatório";
    if (!form.cpf) novosErros.cpf = "CPF é obrigatório";
    if (!form.dtNascimento)
      novosErros.dtNascimento = "Data de nascimento é obrigatória";
    if (!form.endereco) novosErros.endereco = "Endereço é obrigatório";
    if (!form.cep) novosErros.cep = "CEP é obrigatório";

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
        description: "Por favor, preencha todos os campos obrigatórios.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      if (cliente?.id) {
        await atualizarCliente({ ...form, id: cliente.id }); // Passa o ID para atualização
        toast({
          title: "Cliente atualizado",
          description: "Cliente atualizado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await cadastrarCliente(form);
        toast({
          title: "Cliente cadastrado",
          description: "Cliente cadastrado com sucesso!",
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
        <FormLabel>Nome</FormLabel>
        <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
        <FormErrorMessage>{erros.nome}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@exemplo.com"
        />
        <FormErrorMessage>{erros.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.cpf}>
        <FormLabel>CPF</FormLabel>
        <Input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
        <FormErrorMessage>{erros.cpf}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.dtNascimento}>
        <FormLabel>Data de Nascimento</FormLabel>
        <Input type="date" name="dtNascimento" value={form.dtNascimento} onChange={handleChange} />
        <FormErrorMessage>{erros.dtNascimento}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.endereco}>
        <FormLabel>Endereço</FormLabel>
        <Input
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
          placeholder="Rua, número, bairro"
        />
        <FormErrorMessage>{erros.endereco}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.cep}>
        <FormLabel>CEP</FormLabel>
        <Input name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" />
        <FormErrorMessage>{erros.cep}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="teal" w="full" onClick={handleSubmit}>
        {cliente ? "Atualizar Cliente" : "Salvar Cliente"}
      </Button>
    </VStack>
  );
};

export default CadastroCliente;