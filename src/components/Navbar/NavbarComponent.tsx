import React from "react";
import "./NavbarComponent.scss";

interface NavbarComponentProps {
  version: string;
  toggleAboutPopup: () => void;
}

const NavbarComponent: React.FC<NavbarComponentProps> = ({
  toggleAboutPopup,
}) => {
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="navbar-menu">
          <li className="navbar-item">
            <button className="link-button">Arquivo</button>
            <ul>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Novo")}
                >
                  Novo
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Abrir")}
                >
                  Abrir
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Fechar")}
                >
                  Fechar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Salvar")}
                >
                  Salvar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Salvar Como")}
                >
                  Salvar Como
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Importar")}
                >
                  Importar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Exportar")}
                >
                  Exportar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Exemplos")}
                >
                  Exemplos
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Sair")}
                >
                  Sair
                </button>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <button className="link-button">Editar</button>
            <ul>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Retornar")}
                >
                  Retornar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Avançar")}
                >
                  Avançar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Cortar")}
                >
                  Cortar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Copiar")}
                >
                  Copiar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Colar")}
                >
                  Colar
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Deletar")}
                >
                  Deletar
                </button>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <button className="link-button">Desenhar</button>
            <ul>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Lista de Objetos Padrões")}
                >
                  Lista de Objetos Padrões
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Agrupar Objetos")}
                >
                  Agrupar Objetos
                </button>
              </li>
              <li>
                <button
                  className="link-button"
                  onClick={() => console.log("Desagrupar Objetos")}
                >
                  Desagrupar Objetos
                </button>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <button
              className="link-button"
              onClick={() => console.log("Ajuda")}
            >
              Ajuda
            </button>
          </li>
          <li className="navbar-item" onClick={toggleAboutPopup}>
            <button className="link-button">Sobre</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarComponent;
