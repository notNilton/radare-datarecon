import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AiOutlineClose } from "react-icons/ai";
import "./AboutModal.scss";

interface AboutModalProps {
  showAbout: boolean;
  toggleAboutPopup: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({
  showAbout,
  toggleAboutPopup,
}) => {
  const footer = (
    <Button
      label="Fechar"
      icon={<AiOutlineClose />}
      onClick={toggleAboutPopup}
      className="p-button-outlined"
    />
  );

  return (
    <Dialog
      header="Sobre"
      visible={showAbout}
      style={{ width: "50vw" }}
      footer={footer}
      onHide={toggleAboutPopup}
      className="about-dialog"
      aria-labelledby="about-dialog-header"
      aria-describedby="about-dialog-content"
    >
      <div id="about-dialog-content" className="about-content">
        <p>
          A ferramenta de Dashboard de Reconciliation de Dados foi proposta como
          o projeto final para o curso de Engenharia de Computação na
          Universidade Federal de Mato Grosso, Campus Várzea Grande. Este
          projeto tem como objetivo facilitar a análise e visualização de dados,
          fornecendo uma interface amigável e intuitiva para reconciliar dados,
          de preferência Industriais.
        </p>
        <p>
          Para entrar em contato com o desenvolvedor responsável pela
          ferramenta, envie um e-mail para:{" "}
          <a href="mailto:nilton.naab@gmail.com">nilton.naab@gmail.com</a>.
          Feedbacks, sugestões e colaborações são sempre bem-vindos!
        </p>
      </div>
    </Dialog>
  );
};

export default AboutModal;
