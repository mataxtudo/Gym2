import React, { useState } from "react";
import { usePlanoCliente } from "../Contexts/PlanoClienteContext";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Spinner,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

export function VincularPlanoModal({ clienteId }) {
  const { planos, loadingPlanos, vincularPlanoCliente } = usePlanoCliente();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setPlanoSelecionado("");
    onClose();
  };

  const handleVincular = async () => {
    if (!planoSelecionado) {
      toast({
        title: "Selecione um plano",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      await vincularPlanoCliente({
        clienteId,
        planoId: planoSelecionado,
      });

      toast({
        title: "Plano vinculado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao vincular plano",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" size="sm">
        Vincular Plano
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vincular plano ao cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingPlanos ? (
              <Spinner />
            ) : (
              <FormControl isRequired isInvalid={!planoSelecionado && submitting}>
                <FormLabel>Plano</FormLabel>
                <Select
                  placeholder="Selecione um plano"
                  value={planoSelecionado}
                  onChange={(e) => setPlanoSelecionado(e.target.value)}
                >
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - {p.duracao} dias
                    </option>
                  ))}
                </Select>
                {!planoSelecionado && submitting && (
                  <FormErrorMessage>Plano é obrigatório</FormErrorMessage>
                )}
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleVincular}
              isLoading={submitting}
            >
              Vincular
            </Button>
            <Button onClick={handleClose} variant="ghost">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
