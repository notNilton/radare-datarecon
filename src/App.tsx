// Import Libraries
import React, { useState } from "react";
import { Email, GitHub, LinkedIn } from "@mui/icons-material";

// Import Styles
// import "./App.css";
import "./App.scss";
import "./styles/global.css";
import "./components/About/about.css";
import "./components/Canva/Canva.css";

// Import Components
import Node from "./components/Canva/Canva";
// import About from "./components/About/aboutModal";

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("Aba1");
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const handleTabClick = (tabName: string) => {
    setCurrentTab(tabName);
  };

  const toggleAboutPopup = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div className="app-container">
      <header>
        <nav className="navbar">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <a>Arquivo</a>
              <ul>
                <li>
                  <a href="novo">Novo</a>
                </li>
                <li>
                  <a href="abrir">Abrir</a>
                </li>
                <li>
                  <a href="fechar">Fechar</a>
                </li>
                <li>
                  <a href="salvar">Salvar</a>
                </li>
                <li>
                  <a href="salvar-como">Salvar Como</a>
                </li>
                <li>
                  <a href="importar">Importar</a>
                </li>
                <li>
                  <a href="exportar">Exportar</a>
                </li>
                <li>
                  <a href="exemplos">Exemplos</a>
                </li>
                <li>
                  <a href="sair">Sair</a>
                </li>
              </ul>
            </li>
            <li className="navbar-item">
              <a>Editar</a>
              <ul>
                <li>
                  <a href="retornar">Retornar</a>
                </li>
                <li>
                  <a href="avancar">Avançar</a>
                </li>
                <li>
                  <a href="cortar">Cortar</a>
                </li>
                <li>
                  <a href="copiar">Copiar</a>
                </li>
                <li>
                  <a href="colar">Colar</a>
                </li>
                <li>
                  <a href="deletar">Deletar</a>
                </li>
              </ul>
            </li>
            <li className="navbar-item">
              <a>Desenhar</a>
              <ul>
                <li>
                  <a href="objetos-padroes">Lista de Objetos Padrões</a>
                </li>
                <li>
                  <a href="agrupar-objetos">Agrupar Objetos</a>
                </li>
                <li>
                  <a href="desagrupar-objetos">Desagrupar Objetos</a>
                </li>
              </ul>
            </li>
            <li className="navbar-item">
              <a>Ajuda</a>
            </li>
            <li className="navbar-item" onClick={toggleAboutPopup}>
              <a>Sobre</a>
            </li>
            <div className="navbar-icon">
              <img src="/public/assets/userIcon.png" alt="User Icon" />
            </div>
          </ul>
        </nav>
      </header>

      <div className="central-area">
        <Node />
      </div>

      <div className="tab-structure">
        {["Aba1", "Aba2", "Aba3", "Aba4", "Aba5"].map((tab) => (
          <div
            key={tab}
            className={`tab ${currentTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            <a href={tab.toLowerCase()}>{tab}</a>
          </div>
        ))}
      </div>

      <div className="graph-bar-title">
        <a href="analise-resumida">Análise Resumida</a>
      </div>

      <div className="graph-bar-content">
        {/* Placeholder for graph bar content */}
      </div>

      <div className="r-sidebar-structure">
        <div className="sidebar-title">
          <a href="tags-originais">Tags Originais</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Tags Originais content */}
        </div>
        <div className="sidebar-title">
          <a href="tags-reconciliadas">Tags Reconciliadas</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Tags Reconciliadas content */}
        </div>
        <div className="sidebar-title">
          <a href="erros-das-tags">Erros das Tags</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Erros das Tags content */}
        </div>
      </div>

      <div className="l-sidebar-structure">
        <div className="sidebar-title">
          <a href="arvore-funcionalidades">Árvore de Funcionalidades</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Árvore de Funcionalidades content */}
        </div>
        <div className="sidebar-title">
          <a href="analise">Análise</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Análise content */}
        </div>
        <div className="sidebar-title">
          <a href="matriz">Matriz</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Matriz content */}
        </div>
        <div className="sidebar-title">
          <a href="classificacao">Classificação</a>
        </div>
        <div className="sidebar-content">
          {/* Placeholder for Classificação content */}
        </div>
      </div>
      <div
        id="overlay"
        style={{
          display: showAbout ? "block" : "none",
        }}
        onClick={toggleAboutPopup}
      >
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
              Desenvolvida com tecnologias modernas e práticas de
              desenvolvimento de software, a ferramenta permite que os usuários
              identifiquem discrepâncias e inconsistências nos dados, auxiliando
              na tomada de decisões informadas e na garantia de integridade dos
              dados. Além disso, a interface gráfica foi projetada para ser
              acessível e eficiente, permitindo uma navegação rápida e uma
              visualização clara das informações.
            </p>
            <hr />
            <p>
              Este projeto não apenas demonstra o conhecimento técnico adquirido
              ao longo do curso de Engenharia de Computação, mas também reflete
              a capacidade de resolver problemas complexos e de desenvolver
              soluções inovadoras que podem ser aplicadas em diversas áreas,
              como finanças, saúde, logística, entre outras.
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
    </div>
  );
};

export default App;
