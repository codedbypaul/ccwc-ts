import fs from "fs";
import path from "path";
import "mocha";
import { expect } from "chai";
import { execSync } from "child_process";

import { wc } from "../src/wc";

const fileName = "test.txt";

describe("ccwc", () => {
  describe("works with files", () => {
    const filePath = path.join(__dirname, fileName);
    let l = "";
    let w = "";
    let c = "";
    let m = "";

    before(() => {
      const output = execSync(`wc ${filePath}`)
        .toString()
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");

      l = output[0];
      w = output[1];
      c = output[2];
      m = execSync(`wc -m ${filePath}`)
        .toString()
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ")[0];
    });

    it("passed with the -l option", async () => {
      expect(await wc({ l: true }, filePath)).to.equal(`${l} ${fileName}`);
    });

    it("passed with the -w option", async () => {
      expect(await wc({ w: true }, filePath)).to.equal(`${w} ${fileName}`);
    });

    it("passed with the -c option", async () => {
      expect(await wc({ c: true }, filePath)).to.equal(`${c} ${fileName}`);
    });

    it("passed with the -m option", async () => {
      expect(await wc({ m: true }, filePath)).to.equal(`${m} ${fileName}`);
    });

    it("passed with no option", async () => {
      expect(await wc(undefined, filePath)).to.equal(
        `${l} ${w} ${c} ${fileName}`
      );
    });
  });

  describe("works with pipes", () => {
    const filePath = path.join(__dirname, "test.txt");
    let l = "";
    let w = "";
    let c = "";
    let m = "";

    before(() => {
      const output = execSync(`cat ${filePath} | wc`)
        .toString()
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");

      l = output[0];
      w = output[1];
      c = output[2];
      m = execSync(`cat ${filePath} | wc -m`)
        .toString()
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ")[0];
    });

    it("passed with the -l option", async () => {
      const stream = fs.createReadStream(filePath);
      const result = await wc({ l: true }, "", stream);
      stream.destroy();
      expect(result).to.equal(`${l}`);
    });

    it("passed with the -w option", async () => {
      const stream = fs.createReadStream(filePath);
      const result = await wc({ w: true }, "", stream);
      stream.destroy();
      expect(result).to.equal(`${w}`);
    });

    it("passed with the -c option", async () => {
      const stream = fs.createReadStream(filePath);
      const result = await wc({ c: true }, "", stream);
      stream.destroy();
      expect(result).to.equal(`${c}`);
    });

    it("passed with the -m option", async () => {
      const stream = fs.createReadStream(filePath);
      const result = await wc({ m: true }, "", stream);
      stream.destroy();
      expect(result).to.equal(`${m}`);
    });

    it("passed with no option", async () => {
      const stream = fs.createReadStream(filePath);
      const result = await wc(undefined, "", stream);
      stream.destroy();
      expect(result).to.equal(`${l} ${w} ${c}`);
    });
  });

  describe("handles errors with files", () => {
    const filePath = path.join(__dirname, "test.txt");

    it("with an invalid file", async () => {
      await wc({ l: true }, "invalid.txt").catch((error) => {
        expect(error)
          .to.be.an("error")
          .with.property("message", "Invalid file");
      });
    });

    it("passed with an invalid option", async () => {
      await wc({ x: true }, filePath).catch((error) => {
        expect(error)
          .to.be.an("error")
          .with.property("message", "Invalid option");
      });
    });
  });

  describe("handles errors with pipes", () => {
    it("with an invalid steam", async () => {
      await wc().catch((error) => {
        expect(error)
          .to.be.an("error")
          .with.property("message", "Invalid input or file");
      });
    });

    it("passed with an invalid option", async () => {
      const filePath = path.join(__dirname, "test.txt");
      const stream = fs.createReadStream(filePath);
      await wc({ x: true }, "", stream).catch((error) => {
        expect(error)
          .to.be.an("error")
          .with.property("message", "Invalid option");
      });
      stream.destroy();
    });
  });
});
