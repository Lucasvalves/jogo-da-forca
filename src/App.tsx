import styled from 'styled-components';
import './App.css';
import HangmanDranwing from './components/hangman-drawing';
import HangmanWord from './components/hangman-word';
import KeyBoard from './components/KeyBoard';
import { useState, useEffect, useCallback } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
`;
const HangmanPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 375px;
`;
const Title = styled.div`
  font-size: 4rem;
  white-space: nowrap;
`;
const words = [
  'erica',
  'luana',
  'luan',
  'arthur',
  'antonio',
  'helenilsa',
  'laudenira',
  'madalena',
  'edna',
  'nalanda',
];

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  setWordToGuess;
  const [guessedLetters, setGuesseLetters] = useState<string[]>([]); // letras que digitamos

  const incorrectGusses = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter),
  );

  const correctGusses = guessedLetters.filter((letter) =>
    wordToGuess.includes(letter),
  );

  const isLoser = incorrectGusses.length >= 6;
  const isWinner = wordToGuess
    .split('')
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetters = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGuesseLetters((guessedLetters) => [...guessedLetters, letter]);
    },
    [guessedLetters, isLoser, isWinner],
  );

  useEffect(() => {
    const handler = ((e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetters(key);
    }) as unknown as EventListener;

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [guessedLetters]);

  return (
    <Wrapper>
      <HangmanPart>
        {isLoser && 'Você perdeu!! atualize a página para jogar novamente'}
        {isWinner &&
          'Parabéns você venceu!!! Atualize a página para jogar novamente'}
        <Title>Jogo da Forca</Title>
        <HangmanDranwing numberOfGuesses={incorrectGusses.length} />
        <HangmanWord
          reveal={isLoser}
          word={wordToGuess}
          guessedLetters={guessedLetters}
        />
      </HangmanPart>
      <KeyBoard
        disabled={isLoser || isWinner}
        activeleLetters={correctGusses}
        inactiveleLetters={incorrectGusses}
        addGuessedLetters={addGuessedLetters}
      />
    </Wrapper>
  );
}

export default App;
