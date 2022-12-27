#! /usr/bin/env node

const { prompt } = require("enquirer");
const options = {};
let correctAnswer = 0;
let terms = [];

async function main() {
  await setOptions();
  await flashNumbers();
  await checkAnswer();
}

async function setOptions() {
  const response = await prompt([
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

  options.digits = Number(response.digits);
  options.displayCount = Number(response.displayCount);
  options.displayInterval = Number(response.displayInterval);
}

function confirmAnswerValidator(input) {
  return isNaN(input) ? "Please input a Number" : true;
}

async function flashNumbers() {
  await countDown();
  for (let i = 0; i < options.displayCount; i++) {
    await displayNumber();
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

async function displayNumber() {
  const prevNum = terms.slice(-1)[0];
  let num = getNumber();
  while (num == prevNum) {
    num = getNumber();
  }

  correctAnswer += num;
  terms.push(num);

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(String(num));
}

function getNumber() {
  return Math.floor(
    Math.random() * Math.pow(10, options.digits) * 0.9 +
      Math.pow(10, options.digits - 1)
  );
}

async function checkAnswer() {
  const answer = await inputAnswer();

  const result = answer.answer == correctAnswer ? "Correct!!" : "Wrong...";
  console.log(result);
  console.log(`your answer: ${answer.answer}`);
  console.log(`correct answer: ${correctAnswer}`);
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
