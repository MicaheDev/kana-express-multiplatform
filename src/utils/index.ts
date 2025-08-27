export function removeExtensionName(fileName: string): string {

    const removeExtensionRegex = /\.[^/.]+$/;

    const newFileName: string = fileName.replace(removeExtensionRegex, "");

    return newFileName;

}

export function splitCombinationKana(kana: string) {
  if (kana.length !== 2) {
    return null; // O manejar el error como prefieras
  }
  
  const base = kana.slice(0, 1); // Carácter de la izquierda
  const small = kana.slice(1, 2); // Carácter de la derecha
  
  return {
    base: base,
    small: toFullSizeKana(small) // Llamamos a la nueva función para convertir el pequeño a grande.
  };
}

function toFullSizeKana(kana: string): string | null {
  // Verificamos que el carácter sea uno de los esperados.
  // Es importante incluir 'ゅ' y 'ょ' para que la función sea robusta.
  if (['ゃ', 'ゅ', 'ょ'].includes(kana)) {
    // 1. Obtenemos el valor Unicode del carácter pequeño.
    const unicodeValue = kana.charCodeAt(0);
    
    // 2. Sumamos 1 para obtener el valor del carácter de tamaño completo.
    const fullSizeUnicodeValue = unicodeValue + 1;
    
    // 3. Convertimos el nuevo valor a un carácter y lo devolvemos.
    return String.fromCharCode(fullSizeUnicodeValue);
  } else {
    // Si no es un carácter pequeño, devolvemos null para evitar errores.
    console.error(`Error: El carácter "${kana}" no se puede convertir con esta función.`);
    return null;
  }
}