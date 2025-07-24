export const getGreeting = () => {
  const brazilTime = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  });

  const hour = parseInt(brazilTime.split(', ')[1].split(':')[0], 10);

  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  }
  if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  }
  return 'Boa noite';
};

export const getRandomVariation = (variations) => {
  return variations[Math.floor(Math.random() * variations.length)];
};

export const createNaturalMessage = (projectName, isGroup = false) => {
  const greeting = getGreeting();

  if (isGroup) {
    const groupVariations = [
      `${greeting}, pessoal! Tudo bem? \nNova arte da ${projectName} concluída! Podem conferir quando tiverem um tempinho!`,
      `Oie pessoal, tudo bem com vocês? \nPassando pra avisar que a nova arte da ${projectName} foi concluída! Podem revisar quando tiverem um tempinho!`,
      `${greeting}! 😊 \nMais uma arte da ${projectName} concluída! Quando tiverem um momento, deem uma conferida.`,
      `${greeting} pessoal, tudo bem? \nArte nova da ${projectName} finalizada com sucesso. Só dar uma conferida quando for possível!`,
      `Oie, pessoal! Espero que estejam bem! \nA arte nova da ${projectName} foi finalizada. Podem conferir assim que puderem!`,
    ];

    return getRandomVariation(groupVariations);
  }

  const personName = projectName.split(' ')[0] ?? '';

  const individualVariations = [
    `${greeting} ${personName}! Tudo bem? \nSua arte foi finalizada! Pode conferir quando tiver um tempinho.`,
    `Oie ${personName}, tudo bem com você? \nPassando pra avisar que a sua arte está pronta! Pode revisar quando tiver um tempinho!`,
    `${greeting} ${personName}! 😊 \nMais uma arte concluída! Quando tiver um momento, dá uma conferida lá!`,
    `${greeting} ${personName}, tudo bem? \nArte nova prontinha!! Só dar uma conferida quando for possível.`,
    `Oie, ${personName} Espero que esteja bem! \nArte nova finalizada. Disponível para revisão!`,
  ];

  return getRandomVariation(individualVariations);
};
