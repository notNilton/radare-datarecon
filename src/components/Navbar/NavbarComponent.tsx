// NavbarComponent.tsx
import React from "react";
import { AccountCircle } from "@mui/icons-material";
import "./NavbarComponent.scss";

interface NavbarComponentProps {
  version: string;
  toggleAboutPopup: () => void;
}

const NavbarComponent: React.FC<NavbarComponentProps> = ({
  version,
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
            <button className="link-button">Editar</button>
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
            <button className="link-button">Desenhar</button>
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
            <button className="link-button">Ajuda</button>
          </li>
          <li className="navbar-item" onClick={toggleAboutPopup}>
            <button className="link-button">Sobre</button>
          </li>
          <li className="navbar-item navbar-icon">
            <span className="project-version">Versão: {version}</span>
            <AccountCircle className="user-icon" />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarComponent;
