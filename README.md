# HanziFlashcardGeneratorApp
This application's initial goal is to provide an interface for streamlining my process of generating flashcards for learning Chinese characters and vocabulary.  It should assist in adding images using Google Images/GenAI, adding sentences by typing manually correcting and providing more recommendations using GenAI, and formatting the cards for Anki.  It should export this as a file readable to Anki so this can be used by anyone.  It should allow users to do this in batches of words/characters providing some example data sets of words to get started, such as the HSK word sets.

Other potential ideas for this application include:
- Linking cards together with similar characters + potential graph implemetation
- Provide lists of starter character
- Custom built in Flashcard application with SRS implementation
- Accounts + Analytics
- Audio recordings from native speakers

加油！

## Dev Setup
1. Provision PostgreSQL Docker container
<code> docker run -d \
  --name local-postgres \
  -e POSTGRES_USER=myusername \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydatabase \
  -p 5434:5432 \
  postgres:latest</code>
