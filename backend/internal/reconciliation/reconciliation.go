// Package reconciliation fornece a lógica para a reconciliação de dados.
// A reconciliação de dados é um processo estatístico que ajusta um conjunto de medições
// para satisfazer um conjunto de restrições, como leis de conservação.
package reconciliation

import (
	"errors"
	"fmt"
	"gonum.org/v1/gonum/mat"
)

// Reconcile ajusta os valores medidos para que obedeçam às equações de restrição,
// utilizando o método dos multiplicadores de Lagrange para minimizar o erro quadrático ponderado.
//
// A função resolve o seguinte sistema de equações lineares:
//
// | W   B^T | | x |   | W*m |
// |         | |   | = |     |
// | B    0  | | λ |   |  0  |
//
// Onde:
// - x: vetor dos valores reconciliados (o que queremos encontrar).
// - m: vetor dos valores medidos.
// - W: matriz de pesos, diagonal, com W_ii = 1 / σ_i^2, onde σ_i é o desvio padrão da medição i.
// - B: matriz de restrições, onde cada linha representa uma equação de restrição (B*x = 0).
// - λ: vetor dos multiplicadores de Lagrange.
//
// Parâmetros:
//   - measurements: Um slice de float64 representando os valores medidos (m).
//   - tolerances: Um slice de float64 representando as tolerâncias percentuais (p), usadas para calcular os desvios padrão.
//   - constraints: Uma matriz densa (*mat.Dense) representando as equações de restrição (B).
//
// Retorna:
//   - Um slice de float64 com os valores reconciliados (x).
//   - Um erro se os cálculos falharem (ex: matriz singular, dimensões incompatíveis).
func Reconcile(measurements, tolerances []float64, constraints *mat.Dense) ([]float64, error) {
	numMeasurements := len(measurements)
	if numMeasurements == 0 {
		return nil, errors.New("o slice de medições não pode estar vazio")
	}
	if len(tolerances) != numMeasurements {
		return nil, fmt.Errorf("incompatibilidade de dimensão: medições (%d) e tolerâncias (%d)", numMeasurements, len(tolerances))
	}

	numConstraints, cCols := constraints.Dims()
	if cCols != numMeasurements {
		return nil, fmt.Errorf("incompatibilidade de dimensão: colunas das restrições (%d) e medições (%d)", cCols, numMeasurements)
	}

	// Calcula os desvios padrão absolutos (σ_i = m_i * p_i)
	// Assume-se que a tolerância é o desvio padrão relativo.
	absDeviations := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		absDeviations[i] = measurements[i] * tolerances[i]
		if absDeviations[i] == 0 {
			// Evita divisão por zero ao construir a matriz de pesos.
			return nil, fmt.Errorf("a tolerância absoluta para a medição %d é zero, causando divisão por zero", i)
		}
	}

	// Constrói a matriz aumentada do sistema de Lagrange (Matriz 'Peso' no código original).
	// Esta é uma matriz de bloco no formato:
	// [ W   B^T ]
	// [ B    0  ]
	// O fator de 2 foi removido da formulação original para simplicidade, pois ele se cancela.
	totalDim := numMeasurements + numConstraints
	lagrangeMatrix := mat.NewDense(totalDim, totalDim, nil)

	// Bloco superior esquerdo: Matriz de Pesos (W), com W_ii = 1 / σ_i^2
	weightsData := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		weightsData[i] = 1 / (absDeviations[i] * absDeviations[i])
	}
	weightsMatrix := mat.NewDiagDense(numMeasurements, weightsData)
	lagrangeMatrix.Slice(0, numMeasurements, 0, numMeasurements).(*mat.Dense).Copy(weightsMatrix)

	// Bloco superior direito: Transposta da matriz de restrições (B^T)
	lagrangeMatrix.Slice(0, numMeasurements, numMeasurements, totalDim).(*mat.Dense).Copy(constraints.T())

	// Bloco inferior esquerdo: Matriz de restrições (B)
	lagrangeMatrix.Slice(numMeasurements, totalDim, 0, numMeasurements).(*mat.Dense).Copy(constraints)

	// Constrói o vetor do lado direito do sistema de equações (RHS).
	// [ W*m ]
	// [  0  ]
	rhsData := make([]float64, totalDim)
	for i := 0; i < numMeasurements; i++ {
		// (W*m)_i = (1 / σ_i^2) * m_i
		rhsData[i] = weightsData[i] * measurements[i]
	}
	// A parte inferior do vetor (correspondente às restrições) é zero.
	rhsVec := mat.NewVecDense(totalDim, rhsData)

	// Resolve o sistema de equações lineares: lagrangeMatrix * resultVec = rhsVec
	// A solução é: resultVec = inv(lagrangeMatrix) * rhsVec
	var invLagrange mat.Dense
	if err := invLagrange.Inverse(lagrangeMatrix); err != nil {
		// Este erro ocorre se a matriz for singular, o que pode acontecer se as restrições
		// forem linearmente dependentes ou se o sistema for mal condicionado.
		return nil, errors.New("a matriz de lagrange é singular e não pode ser invertida, verifique as restrições")
	}

	var resultVec mat.VecDense
	resultVec.MulVec(&invLagrange, rhsVec)

	// Extrai os valores reconciliados (x) do vetor de resultado.
	// O vetor de resultado contém os valores reconciliados (x) nas primeiras `numMeasurements` posições
	// e os multiplicadores de Lagrange (λ) nas posições restantes.
	reconciled := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		reconciled[i] = resultVec.AtVec(i)
	}

	return reconciled, nil
}