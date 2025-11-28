# german_vocabulary

A simple web application for practicing German vocabulary. The app displays a random German word, phrase, or preposition, and allows the user to reveal its Spanish translation.

The vocabulary is loaded asynchronously from local JSON files, making it easy to extend and manage.

## Data Files

The vocabulary is organized into multiple JSON files located in the `docs/data/` directory.

### `docs/data/nouns.json`

This file contains German nouns. Each entry includes the singular form, the plural form, its grammatical article, and the Spanish translation.

```json
{ "word": "Stadt", "plural": "Städte", "article": "die", "translation": "ciudad" }
```

### `docs/data/verbs.json`

Contains German verbs. The structure is similar to other files, providing the verb and its translation.

```json
{ "word": "sein", "translation": "ser, estar" }
```

### `docs/data/adjectives.json`

This file lists German adjectives with their corresponding Spanish translation.

```json
{ "word": "gut", "translation": "bueno" }
```

### `docs/data/adverbs.json`

Contains German adverbs, including their type (e.g., location, time) and translation.

```json
{ "word": "hier", "type": "Adverb des Ortes", "translation": "aquí" }
```

### `docs/data/sentences.json`

This file contains common German phrases and sentences along with their Spanish translations.

```json
{ "word": "Guten Tag.", "translation": "Buenas tardes / buen día." }
```

### `docs/data/prepositions.json`

This file is dedicated to German prepositions. It includes the preposition, the grammatical case(s) it governs (Dativ, Akkusativ, Genitiv), and its Spanish translation.

```json
{ "word": "auf", "cases": ["Akkusativ", "Dativ"], "translation": "sobre, en, encima de" }
```

### `docs/data/basics.json`

This file groups fundamental vocabulary into a single JSON object, where each key represents a distinct category. The application automatically loads and combines the word lists from all categories within this file.

While most entries follow a simple `{"word": "...", "translation": "..."}` format, some categories include additional information like the grammatical article.

The categories are:

*   **`questions`**: Basic question words.
    ```json
    { "word": "wie", "translation": "cómo" }
    ```

*   **`days`**: Days of the week.
    ```json
    { "word": "Montag", "translation": "lunes" }
    ```

*   **`month`**: Months of the year, including their article.
    ```json
    { "word": "Januar", "article": "der", "translation": "enero" }
    ```

*   **`seasons`**: The four seasons, including their article.
    ```json
    { "word": "Frühling", "article": "der", "translation": "primavera" }
    ```

*   **`countries`**: A selection of countries, with their article if applicable.
    ```json
    { "word": "Die Schweiz", "article": "die", "translation": "Suiza" }
    ```

*   **`languages`**: Names of languages.
    ```json
    { "word": "Deutsch", "translation": "alemán" }
    ```

### `docs/data/numbers.json`

This file contains German numbers with their Spanish translation.

```json
{ "word": "eins", "translation": "uno" }
```

### `docs/data/pronouns.json`

This file lists common German pronouns and their Spanish translation.

```json
{ "word": "ich", "translation": "yo" }
```
