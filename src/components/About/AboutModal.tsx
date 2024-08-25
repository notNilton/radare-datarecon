import React from "react";
import { Email, GitHub, LinkedIn } from "@mui/icons-material";
import "./AboutModal.scss";

const AboutModal = ({ showAbout, toggleAboutPopup }) => {
  if (!showAbout) return null;

  return (
    <div id="overlay" onClick={toggleAboutPopup}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="button-and-title">
          <h2>Sobre</h2>
          <button className="close-btn" onClick={toggleAboutPopup}>
            ×
          </button>
        </div>
        <div className="text-content">
          <hr />
          <p>
            A ferramenta Dashboard de Reconciliação de Dados foi proposta como
            trabalho de conclusão do curso de Engenharia de Computação da
            Universidade Federal de Mato Grosso, Campus Várzea Grande. Este
            projeto tem como objetivo facilitar a análise e a visualização de
            dados, fornecendo uma interface amigável e intuitiva para
            reconciliar informações de diferentes fontes.
          </p>
          <hr />
          <p>
            Desenvolvida com tecnologias modernas e práticas de desenvolvimento
            de software, a ferramenta permite que os usuários identifiquem
            discrepâncias e inconsistências nos dados, auxiliando na tomada de
            decisões informadas e na garantia de integridade dos dados. Além
            disso, a interface gráfica foi projetada para ser acessível e
            eficiente, permitindo uma navegação rápida e uma visualização clara
            das informações.
          </p>
          <hr />
          <p>
            Este projeto não apenas demonstra o conhecimento técnico adquirido
            ao longo do curso de Engenharia de Computação, mas também reflete a
            capacidade de resolver problemas complexos e de desenvolver soluções
            inovadoras que podem ser aplicadas em diversas áreas, como finanças,
            saúde, logística, entre outras.
          </p>
          <hr />
          <p>
            Estamos comprometidos com a contínua melhoria e expansão das
            funcionalidades da ferramenta, buscando sempre atender às
            necessidades dos usuários e acompanhar as evoluções tecnológicas.
          </p>
          <hr />
          <p>
            Para entrar em contato com o desenvolvedor responsável pela
            ferramenta, envie um email para:{" "}
            <a href="mailto:nilton.naab@gmail.com">nilton.naab@gmail.com</a>.
            Feedbacks, sugestões e colaborações são sempre bem-vindos!
          </p>
        </div>
        <hr />
        <h3>Contatos</h3>
        <hr />
        <div className="contacts">
          <div className="contact">
            <a href="mailto:nilton.naab@gmail.com">
              <Email />
            </a>
          </div>
          <div className="contact">
            <a
              href="https://github.com/notNilton"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
            </a>
          </div>
          <div className="contact">
            <a
              href="https://linkedin.com/in/notNilton"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
