async function main() {
  const { ALL_DAYS, ACHIEVEMENTS, UPGRADES, ARCADE_ITEMS, QUIZ_QUESTIONS } = await import("./loader");
  const totalEmails = ALL_DAYS.reduce((sum, d) => sum + d.emails.length, 0);
  console.log(
    `OK: ${ALL_DAYS.length} dias, ${totalEmails} emails, ${ACHIEVEMENTS.length} conquistas, ${UPGRADES.length} upgrades, ${ARCADE_ITEMS.length} itens de arcade, ${QUIZ_QUESTIONS.length} perguntas de quiz validados.`,
  );
}

main().catch((error) => {
  console.error("Falha na validação de conteúdo:");
  console.error(error);
  process.exit(1);
});
