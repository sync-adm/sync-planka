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
      `${greeting} pessoal! 👋\n\nTemos uma nova arte da ${projectName} pronta para revisão! ✨`,
      `${greeting}, pessoal! 🎨\n\nA nova arte da ${projectName} está finalizada e aguardando vocês!`,
      `${greeting}! 😊\n\nMais uma arte da ${projectName} saiu do forno! Podem revisar quando tiverem um tempinho.`,
      `${greeting}, galera! 🚀\n\nNova arte da ${projectName} concluída! Podem conferir quando tiverem um tempinho.`,
    ];

    return getRandomVariation(groupVariations);
  }

  const individualVariations = [
    `${greeting}! 😊\n\nTenho uma ótima notícia: sua nova arte está pronta! ✨\n\nPode acessar o sistema para conferir.`,
    `${greeting}! 🎨\n\nSua arte foi finalizada com muito carinho! Espero que goste do resultado.\n\nJá está disponível no sistema.`,
    `${greeting}! 👋\n\nVenho te avisar que sua arte está prontinha! 🚀\n\nDá uma olhada lá no sistema quando puder.`,
    `${greeting}! ✨\n\nSua nova arte está finalizada!\n\nJá pode conferir no sistema.`,
    `${greeting}! 😍\n\nTenho certeza que vai amar sua nova arte! Acabamos de finalizar.\n\nEla já está te esperando no sistema.`,
  ];

  return getRandomVariation(individualVariations);
};
