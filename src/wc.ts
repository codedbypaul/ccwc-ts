import fs from "fs";
import path from "path";
import { OptionValues } from "commander";

const readFile = (fileName: string) => fs.readFileSync(fileName).toString();

const readStream = async (
  stream: NodeJS.ReadStream | fs.ReadStream
): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const byteCount = (fileName: string) => {
  return fs.statSync(fileName).size;
};

const lineCount = (file: string) => {
  return file.split(/\r\n|\r|\n/).length - 1;
};

const wordCount = (file: string) => {
  return file.trim().split(/\s+/).length;
};

const charCount = (file: string) => {
  return file.length;
};

const wc = async (
  options?: OptionValues,
  filePath?: string,
  stream?: NodeJS.ReadStream | fs.ReadStream
) => {
  // handles missing filePath and stream
  if (filePath === undefined && stream === undefined) {
    throw new Error("Invalid input or file");
  }

  // handles files
  if (filePath) {
    if (fs.existsSync(filePath)) {
      const file = readFile(filePath);
      const fileName = path.basename(filePath);
      let result: number[] = [];
      if (options) {
        const selectedOptions = Object.keys(options);
        const regex = /(c|l|w|m)/g;
        if (selectedOptions.some((e) => regex.test(e))) {
          const { c, l, w, m } = options;

          if (c) {
            result.push(byteCount(filePath));
          }

          if (l) {
            result.push(lineCount(file));
          }

          if (w) {
            result.push(wordCount(file));
          }

          if (m) {
            result.push(charCount(file));
          }
        } else {
          throw new Error("Invalid option");
        }
      } else {
        result.push(lineCount(file));
        result.push(wordCount(file));
        result.push(byteCount(filePath));
      }

      return `${result.join(" ")} ${fileName}`;
    }
  }

  // handles pipe
  if (stream) {
    const buffer = await readStream(stream);
    const file = buffer.toString();
    let result: number[] = [];

    if (options) {
      const selectedOptions = Object.keys(options);
      const regex = /(c|l|w|m)/g;
      if (selectedOptions.some((e) => regex.test(e))) {
        const { c, l, w, m } = options;

        if (c) {
          result.push(buffer.length);
        }

        if (l) {
          result.push(lineCount(file));
        }

        if (w) {
          result.push(wordCount(file));
        }

        if (m) {
          result.push(charCount(file));
        }
      } else {
        throw new Error("Invalid option");
      }
    } else {
      result.push(lineCount(file));
      result.push(wordCount(file));
      result.push(buffer.length);
    }

    return `${result.join(" ")}`;
  }
};

export { wc };
