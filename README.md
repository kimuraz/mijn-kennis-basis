# Project Name

MijnKennisBasis - Small CLI App for Personal Questions and Answers Database

## Description

MijnKennisBasis is a small command-line interface (CLI) application written in JavaScript. It allows you to store and manage your own personal knowledge base by creating pairs of questions and answers. With MijnKennisBasis, you can search for specific terms within your question and answer database, merge databases, and customize word replacements.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```shell
   git clone git@github.com:kimuraz/mijn-kennis-basis.git
   ```

2. Navigate to the project directory:

   ```shell
   cd mijn-kennis-basis
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

4. Set up the environment variables (see [Environment Variables](#environment-variables) section).

## Usage

To use MijnKennisBasis, open a command-line interface and navigate to the project directory.

```shell
cd /path/to/mijn-kennis-basis
```

Run the following command to display the available commands and their descriptions:

```shell
cp .env.example .env
node kennis.js help
```

The available commands are:

- `help` (or `h`) - Displays help.
- `new` (or `n`) - Creates a new pair of questions and answers.
- `search` (or `s`) - Performs a full-text search for terms within the questions and answers database.
- `merge` - Merges two databases. The second database file path should be passed as an argument.

For example, to create a new pair of questions and answers, use the following command:

```shell
node kennis.js new "[question]" "[answer]"
```
> Note: If the question requires multiple answers, include the answers separated by `+`.

To search for terms within the database, use the following command:

```shell
node kennis.js search [search-term]
```

To merge two databases, use the following command:

```shell
node kennis.js merge [second-database-file]
```

## Environment Variables

The following environment variables can be set:

- `DB_FILE` - Specifies the path to the database file. The file should be in JSON format.
- `REPLACE_WORDS` - A list of word replacement pairs in the format "REPLACE:BY" separated by commas. These replacements will be automatically applied when registering a new question-answer key, for both the questions and the answers.

Example usage:

```shell
DB_FILE=/path/to/database.json
REPLACE_WORDS=replace1:by1,replace2:by2,replace3:by3
```

## License

This project is licensed under the terms of the MIT license. For more information, please refer to the [LICENSE](LICENSE) file.

---

Happy knowledge storing with MijnKennisBasis!