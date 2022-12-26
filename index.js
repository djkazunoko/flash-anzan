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
    },
    {
      type: "input",
      name: "displayCount",
      message: "Display Count",
    },
    {
      type: "input",
      name: "displayInterval",
      message: "Display Interval(seconds)",
    },
  ]);

  options.digits = Number(response.digits);
  options.displayCount = Number(response.displayCount);
  options.displayInterval = Number(response.displayInterval);
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
  console.log("\x1b[31m%s\x1b[0m", "Ready");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("\x1b[33m%s\x1b[0m", "Set");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("\x1b[32m%s\x1b[0m", "Go!!");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function displayNumber() {
  const num = Math.floor(
    Math.random() * Math.pow(10, options.digits) * 0.9 +
      Math.pow(10, options.digits - 1)
  );

  correctAnswer += num;
  terms.push(num);

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(String(num));
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
  };

  return await prompt(question);
}

main();
