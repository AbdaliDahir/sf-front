export const DISPLAY = true;
export const BORDER = true;
export const CHART_AREA = true;
export const TICKS = true;

export const COLORS = {
    blue: 'rgba(53, 162, 235, 0.7)',
    red: 'rgba(215, 56, 53, 0.7)',
    yellow: 'rgba(255, 205, 86, 0.7)',
    ltRed: 'rgba(239, 157, 155, 1)',
    purple: 'rgba(150, 71, 147, 0.7)',
    green: 'rgba(13, 117, 119, 0.7)',
    darkBlue: 'rgba(21, 98, 175, 0.7)',
    orange: 'rgba(255, 159, 64, 0.7)',
    ltpurple: 'rgba(189, 63, 92, 0.7)',
    ltGreen: 'rgba(38, 194, 129, 0.7)',
    ltOrange: 'rgba(255, 140, 140, 0.7)',
    ltGrey: 'rgba(255, 255, 255, 0.7)',
    pink: 'rgba(255, 99, 132, 1)',
    white: '#FFF',
    black: '#000',
    grey: '#e1e1e1' // grid lines accept only hex colors...
};

export const BAR_ZERO = 0.055 // Pour les bars qui doivent être representées sur le graph mais dont la valeur est à zéro (les 0€, gratuit, inclus, etc...)

export const BAR_NULL = 0.099 // (Le composant attend autant de bar par facture qu'il y a de legends... on ajoute donc 0.099 pour créer une sorte de mapping et obtenir des arrays de même longueur)

export const UNDER_VALUE = -2

export const OVER_VALUE = 2

export const POURCENT = 0.05 // 5% du montant le plus haut

