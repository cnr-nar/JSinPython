/**
 * if you use async function u have to use spawnSync
 * otherwise use spawn to single line or a statement
 */

"use strict";

const { spawnSync, spawn } = require("child_process");
const { readFile } = require("fs/promises");
const { appendFile } = require("fs/promises");
const { join } = require("path");
const express = require("express");

const app = express();
const port = 3000;

app.get("/", async (req, res, next) => {

  const X = [1, 2, 5]; // large array
  const y = [
    [1, 2],
    [2, 3],
    [1, 2],
  ]; // large array

  await appendFile(join(`spawnSync-test/scripts/args.json`), JSON.stringify({ X, y }), {
    encoding: "utf-8",
    flag: "w",
  });

  const python = await spawnSync("python", [
    "./spawnSync-test/scripts/demo.py",
    "first_function",
    "./spawnSync-test/scripts/args.json",
    "./spawnSync-test/scripts/results.json",
  ]);
  const result = python.stdout?.toString()?.trim();
  const error = python.stderr?.toString()?.trim();

  const status = result === "OK";

  // in close event we are sure that stream from child process is closed

  if (status) {
    const buffer = await readFile("./spawnSync-test/scripts/results.json");
    const resultParsed = JSON.parse(buffer?.toString());
    res.send(resultParsed.toString());

  } else {
    console.log(error);
    res.send(JSON.stringify({ status: 500, message: "Server error" }));

  }
});

app.listen(port, () => console.log(`Example app listenin on port ${port}!`));

