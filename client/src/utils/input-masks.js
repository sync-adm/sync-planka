function maskPhone(value) {
  if (!value) {
    return '';
  }

  let cleanedValue = value;
  if (cleanedValue.startsWith('+55')) {
    cleanedValue = cleanedValue.replace('+55', '');
  }

  let v = cleanedValue.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
}

export default maskPhone;
