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
