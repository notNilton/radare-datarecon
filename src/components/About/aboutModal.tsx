import React, { useState } from "react";
import "./about.css"; // Import your styles here

function About() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(true);
  };

  return (
    <div className={`about ${isVisible ? "" : "hidden"}`}>
      <div className="aboutHeader">
        <div className="title">Sobre</div>
        <button className="closeButton" onClick={handleClose}>
          &times;
        </button>
      </div>
      <div className="aboutBody">
        Ferramenta de reconciliação de dados utilizando método de
        multiplicadores de Laplace, inteiramente programada por Nilton Aguiar
        dos Santos, como trabalho de conclusão do curso de Engenharia de
        Computação da Universidade Federal de Mato Grosso, Campus de Várzea
        Grande. Orientado pelo Professor Doutor João Gustavo Coelho Pena. As
        tecnologias aplicadas nele são: Node.js, React, React Flow, TypeScript e
        MySQL.
      </div>
      <div className="aboutContacts">
        <div className="aboutContactsHeader">
          <div className="title">Contatos</div>
        </div>
        <div className="aboutContactsBody">
          <div className="tooltip" id="github">
            <span className="tooltiptext">Conta do Github</span>
            <img src="/public/assets/githubIcon.png" alt="GitHub Icon" />
          </div>
          <div className="tooltip" id="linkedin">
            <span className="tooltiptext">Conta do Linkedin</span>
            <img src="/public/assets/linkedinIcon.png" alt="Linkedin Icon" />
          </div>
          <div className="tooltip" id="portfolio">
            <span className="tooltiptext">Portfolio</span>
            <img src="/public/assets/portfolioIcon.png" alt="Portfolio Icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
