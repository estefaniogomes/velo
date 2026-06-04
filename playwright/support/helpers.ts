export function generateOrderCode() {
    const prefix = 'VLO-';
  
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let randomLetters = '';
    let randomNumbers = '';
  
    // 3 letras aleatórias
    for (let i = 0; i < 3; i++) {
      randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  
    // 3 números aleatórios
    for (let i = 0; i < 3; i++) {
      randomNumbers += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  
    return `${prefix}${randomLetters}${randomNumbers}`;
  }