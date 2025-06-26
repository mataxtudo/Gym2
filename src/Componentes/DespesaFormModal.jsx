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
import { useDespesas } from "../Contexts/DespesaContext";

const DespesaFormModal = ({ despesa, onClose }) => {
  const { cadastrarDespesa, editarDespesa } = useDespesas();
  const toast = useToast();

  const [form, setForm] = useState({
    descricao: "",
    vlTotal: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (despesa) {
      setForm({
        descricao: despesa.descricao || "",
        vlTotal: despesa.vlTotal ? despesa.vlTotal.toString() : "",
      });
    } else {
      setForm({
        descricao: "",
        vlTotal: "",
      });
    }
  }, [despesa]);

  const validar = () => {
    const novosErros = {};
    if (!form.descricao) novosErros.descricao = "Descrição é obrigatória";
    if (!form.vlTotal) {
      novosErros.vlTotal = "Valor é obrigatório";
    } else if (isNaN(Number(form.vlTotal)) || Number(form.vlTotal) <= 0) {
      novosErros.vlTotal = "Valor deve ser um número maior que zero";
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
        description: "Preencha todos os campos corretamente.",
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

      if (despesa?.id) {
        await editarDespesa(despesa.id, data);
        toast({
          title: "Despesa atualizada",
          description: "Despesa atualizada com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await cadastrarDespesa(data);
        toast({
          title: "Despesa cadastrada",
          description: "Despesa cadastrada com sucesso!",
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
        <FormLabel>Descrição</FormLabel>
        <Input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição da despesa"
        />
        <FormErrorMessage>{erros.descricao}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!erros.vlTotal} isRequired>
        <FormLabel>Valor Total</FormLabel>
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
        {despesa ? "Atualizar Despesa" : "Salvar Despesa"}
      </Button>
    </VStack>
  );
};

export default DespesaFormModal;
