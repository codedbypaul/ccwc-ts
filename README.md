# ccwc-ts

An implementation of the Unix command wc in Typescript as seen on [Coding Challenges](https://codingchallenges.substack.com/p/coding-challenge-1).

## Usage

`wc <filename>` or to use a pipe `cat <filename> | wc`

### Options

- `-c` - Outputs the number of bytes
- `-l` - Outputs the number of lines
- `-w` - Outputs the number of words
- `-m` - Outputs the number of characters. [1]

If no option specifed, defaults to `-c`, `-l` and `-w` options.

[1] Will match the `-c` option if the current locale doesn't support multibyte characters.
