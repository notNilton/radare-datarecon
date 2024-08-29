import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AiOutlineClose } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import "./AboutModal.scss";

interface AboutModalProps {
  showAbout: boolean;
  toggleAboutPopup: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({
  showAbout,
  toggleAboutPopup,
}) => {
  return (
    <Dialog.Root open={showAbout} onOpenChange={toggleAboutPopup}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <FaInfoCircle className="header-icon" />
            <Dialog.Title className="dialog-title">Sobre</Dialog.Title>
            <Dialog.Close className="close-button">
              <AiOutlineClose />
            </Dialog.Close>
          </div>
          <div className="about-content">
            <p>
              A ferramenta de Dashboard de Reconciliation de Dados foi proposta
              como o projeto final para o curso de Engenharia de Computação na
              Universidade Federal de Mato Grosso, Campus Várzea Grande. Este
              projeto tem como objetivo facilitar a análise e visualização de
              dados, fornecendo uma interface amigável e intuitiva para
              reconciliar dados, de preferência Industriais.
            </p>
            <p>
              Para entrar em contato com o desenvolvedor responsável pela
              ferramenta, envie um e-mail para:{" "}
              <a href="mailto:nilton.naab@gmail.com">nilton.naab@gmail.com</a>.
              Feedbacks, sugestões e colaborações são sempre bem-vindos!
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AboutModal;
