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
import { useReceita } from "../Contexts/ReceitaContext";

const ReceitaFormModal = ({ receita, onClose }) => {
  const { cadastrarReceita, atualizarReceita } = useReceita();
  const toast = useToast();

  const [form, setForm] = useState({
    descricao: "",
    vlTotal: "",
    descricao: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (receita) {
      setForm({
        descricao: receita.descricao || "",
        vlTotal: receita.vlTotal ? receita.vlTotal.toString() : "",
       
      });
    } else {
      setForm({
        descricao: "",
        vlTotal: "",

      });
    }
  }, [receita]);

  const validar = () => {
    const novosErros = {};
    if (!form.descricao) novosErros.descricao = "descricao é obrigatório";
    if (!form.vlTotal) {
      novosErros.vlTotal = "vlTotal é obrigatório";
    } else if (isNaN(Number(form.vlTotal)) || Number(form.vlTotal) <= 0) {
      novosErros.vlTotal = "vlTotal deve ser número maior que zero";
    }
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
      description: "Por favor, preencha todos os campos obrigatórios corretamente.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return;
  }

  try {
    const data = {
      descricao: form.descricao,
      vlTotal: parseFloat(form.vlTotal),
    };

    if (receita?.id) {
      await atualizarReceita(receita.id, data); // <-- CORRETO
      toast({
        title: "Receita atualizada",
        description: "Receita atualizada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      await cadastrarReceita(data);
      toast({
        title: "Receita cadastrada",
        description: "Receita cadastrada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  } catch (error) {
    toast({
      title: "Erro no cadastro/atualização",
      description: error.message || "Erro desconhecido",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};

  return (
    <VStack spacing={4} as="form" onSubmit={handleSubmit}>
      <FormControl isInvalid={!!erros.descricao} isRequired>
        <FormLabel>descricao</FormLabel>
        <Input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="descricao da receita"
        />
        <FormErrorMessage>{erros.descricao}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.vlTotal} isRequired>
        <FormLabel>vlTotal</FormLabel>
        <Input
          name="vlTotal"
          value={form.vlTotal}
          onChange={handleChange}
          placeholder="0.00"
          type="number"
          step="0.01"
          min="0"
        />
        <FormErrorMessage>{erros.vlTotal}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="teal" w="full" type="submit">
        {receita ? "Atualizar Receita" : "Salvar Receita"}
      </Button>
    </VStack>
  );
};

export default ReceitaFormModal;
