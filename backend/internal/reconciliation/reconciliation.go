package reconciliation

import (
	"errors"
	"fmt"
	"gonum.org/v1/gonum/mat"
)

// Reconcile ajusta os valores medidos para que obedeçam às equações de restrição.
//
// Parâmetros:
//   - measurements: Um slice de float64 representando os valores medidos (m).
//   - tolerances: Um slice de float64 representando as tolerâncias percentuais (p).
//   - constraints: Uma matriz densa representando as equações de restrição (B).
//
// Retorna:
//   - Um slice de float64 com os valores reconciliados.
//   - Um erro se os cálculos falharem (ex: matriz singular).
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

	// Calcula os desvios absolutos (a = m .* p)
	absDeviations := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		absDeviations[i] = measurements[i] * tolerances[i]
		if absDeviations[i] == 0 {
			return nil, fmt.Errorf("a tolerância absoluta para a medição %d é zero, causando divisão por zero", i)
		}
	}

	// Constrói a matriz de pesos (Peso)
	// Esta é uma matriz de bloco no formato:
	// [ Diag(2/a_i^2)   B^T ]
	// [      B            0   ]
	totalDim := numMeasurements + numConstraints
	pesoMatrix := mat.NewDense(totalDim, totalDim, nil)

	// Bloco superior esquerdo: Diag(2/a_i^2)
	diagData := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		diagData[i] = 2 / (absDeviations[i] * absDeviations[i])
	}
	diagMatrix := mat.NewDiagDense(numMeasurements, diagData)
	pesoMatrix.Slice(0, numMeasurements, 0, numMeasurements).(*mat.Dense).Copy(diagMatrix)

	// Bloco superior direito: B^T
	pesoMatrix.Slice(0, numMeasurements, numMeasurements, totalDim).(*mat.Dense).Copy(constraints.T())

	// Bloco inferior esquerdo: B
	pesoMatrix.Slice(numMeasurements, totalDim, 0, numMeasurements).(*mat.Dense).Copy(constraints)

	// Constrói o vetor de medições ponderadas (mpeso)
	mpesoData := make([]float64, totalDim)
	for i := 0; i < numMeasurements; i++ {
		mpesoData[i] = 2 * measurements[i] / (absDeviations[i] * absDeviations[i])
	}
	mpesoVec := mat.NewVecDense(totalDim, mpesoData)

	// Resolve o sistema de equações lineares: Peso * Result = mpeso
	// A solução é: Result = inv(Peso) * mpeso
	var invPeso mat.Dense
	if err := invPeso.Inverse(pesoMatrix); err != nil {
		return nil, errors.New("a matriz de pesos é singular e não pode ser invertida")
	}

	var resultVec mat.VecDense
	resultVec.MulVec(&invPeso, mpesoVec)

	// Extrai os valores reconciliados do vetor de resultado
	reconciled := make([]float64, numMeasurements)
	for i := 0; i < numMeasurements; i++ {
		reconciled[i] = resultVec.AtVec(i)
	}

	return reconciled, nil
}