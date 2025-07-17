/**
 * Extrai o domínio raiz de uma URL, removendo protocolo e "www.".
 * @param {string} url
 * @returns {string}
 */
export default function getDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('URL inválida:', url);
    return '';
  }
}

/**
 * Converte uma string em um slug (só letras, números e hífens), respeitando a opção lower.
 * @param {string} text – texto de entrada
 * @param {{ lower?: boolean }} [options] – configurações (por padrão, lower = true)
 * @returns {string} slug gerado
 */
export function slugify(text, options = {}) {
  const { lower = true } = options;

  // 1) Normaliza para NFD e remove acentos
  // 2) Substitui tudo que não for letra/número por hífen
  // 3) Elimina hífens duplicados e nas pontas
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (lower) {
    slug = slug.toLowerCase();
  }

  return slug;
}
