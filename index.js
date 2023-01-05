#! /usr/bin/env node

const { prompt } = require("enquirer");
let correctAnswer = 0;
let terms = [];

async function main() {
  await flashNumbers();
  await checkAnswer();
}

async function getOptions() {
  return await prompt([
    {
      type: "input",
      name: "digits",
      message: "Number of Digits",
      validate: confirmAnswerValidator,
      initial: 1,
    },
    {
      type: "input",
      name: "displayCount",
      message: "Display Count",
      validate: confirmAnswerValidator,
      initial: 10,
    },
    {
      type: "input",
      name: "displayInterval",
      message: "Display Interval(seconds)",
      validate: confirmAnswerValidator,
      initial: 1,
    },
  ]);
}

function confirmAnswerValidator(input) {
  return isNaN(input) ? "Please input a Number" : true;
}

async function flashNumbers() {
  const options = await getOptions();
  await countDown();
  for (let i = 0; i < options.displayCount; i++) {
    await displayNumber(options);
    await new Promise((resolve) =>
      setTimeout(resolve, options.displayInterval * 1000)
    );
  }
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

async function countDown() {
  const texts = [
    "\x1b[31mReady\x1b[0m",
    "\x1b[33mSet\x1b[0m",
    "\x1b[32mGo!\x1b[0m",
  ];
  for (const text of texts) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(text);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function displayNumber(options) {
  const prevNum = terms.slice(-1)[0];
  let num = getNumber(options);
  while (num == prevNum) {
    num = getNumber(options);
  }

  correctAnswer += num;
  terms.push(num);

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(String(num));
}

function getNumber(options) {
  return Math.floor(
    Math.random() * Math.pow(10, options.digits) * 0.9 +
      Math.pow(10, options.digits - 1)
  );
}

async function checkAnswer() {
  const answer = await inputAnswer();
  const result =
    answer.answer == correctAnswer
      ? "\x1b[32mCorrect!\x1b[0m"
      : "\x1b[31mWrong...\x1b[0m";
  const yourAnswer =
    answer.answer == correctAnswer
      ? `\x1b[32m${answer.answer}\x1b[0m`
      : `\x1b[31m${answer.answer}\x1b[0m`;
  console.log(result);
  console.log(`your answer: ${yourAnswer}`);
  console.log(`correct answer: \x1b[32m${correctAnswer}\x1b[0m`);
  console.log(`${terms.join(" + ")} = ${correctAnswer}`);
}

async function inputAnswer() {
  const question = {
    type: "input",
    name: "answer",
    message: "Please enter your answer",
    validate: confirmAnswerValidator,
    initial: 0,
  };

  return await prompt(question);
}

main();
