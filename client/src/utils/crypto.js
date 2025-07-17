/* eslint-disable import/no-extraneous-dependencies */
import CryptoJS from 'crypto-js';

/**
 * Descriptografa um texto AES-CBC/PKCS7 codificado em URL-safe Base64,
 */
export default function decryptAesCsharp(cipherText, keyStr, ivStr) {
  let b64 = cipherText.replace(/-/g, '+').replace(/_/g, '/');
  // eslint-disable-next-line default-case
  switch (b64.length % 4) {
    case 2:
      b64 += '==';
      break;
    case 3:
      b64 += '=';
      break;
  }

  let encryptedWA;
  try {
    encryptedWA = CryptoJS.enc.Base64.parse(b64);
  } catch (err) {
    return '';
  }

  let keyWA;
  let ivWA;
  try {
    keyWA = CryptoJS.enc.Utf8.parse(keyStr);
    ivWA = CryptoJS.enc.Utf8.parse(ivStr);
  } catch (err) {
    return '';
  }

  let decryptedWA;
  try {
    decryptedWA = CryptoJS.AES.decrypt({ ciphertext: encryptedWA }, keyWA, {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  } catch (err) {
    return '';
  }

  const plainText = decryptedWA.toString(CryptoJS.enc.Utf8);
  return plainText;
}
