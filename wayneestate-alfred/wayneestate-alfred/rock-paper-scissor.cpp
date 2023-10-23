#include<iostream>
#include <cstdlib>
using namespace std;

enum GameMode {
	PLAYER_VS_COMPUTER,
  COMPUTER_VS_COMPUTER
};

enum Move {
  ROCK,
  PAPER,
  SCISSOR
};

enum Result {
  PLAYER1_WINS,
  PLAYER2_WINS,
  DRAW
};

static int THRESHOLD = 5;

class Game {
	// int player1_id;
  // int player2_id;
  GameMode mode;

  Move getRandomMove() {
    return rand()%3;
  }

  Result getResult(Move mv1, Move mv2) {
    if (mv1 == mv2) {
      return DRAW;
    }

    if ((mv1 == ROCK && mv2 == PAPER) || (mv1 == PAPER && mv2 == SCISSOR) || (mv1 == SCISSOR && mv2 == ROCK))
      return PLAYER2_WINS;
    
    return PLAYER1_WINS;
  }

  Result play(GameMode mode) {
    if (mode == PLAYER_VS_COMPUTER) {
      Move player_mv;
      int count = 0;

      while (count < THRESHOLD) {
        count++;
        cout << "Please choose your move. Press 0 for rock, 1 for paper, 2 for scissor." << endl;
        int x;
        cin >> x;

        if (x < 0 || x > 2) {
          cout << "Invalid move. please try again.";
          continue;
        }

        player_mv = x;
        break;
      }

      Move computer_mv = getRandomMove();

      Result res = getResult(player_mv, computer_mv);
    } else if (mode == COMPUTER_VS_COMPUTER) {
      Move m1 = getRandomMove();
      Move m2 = getRandomMove();

      Result res = getResult(m1, m2);
    }

    return res;
  }  
};

int main() {
  GameMode mode;

  cin >> mode;

  if (mode < 0 || mode > 2) {
    cout << "Incorrect mode.";
  }

  Result r = play(mode);

  switch (r) {
    case PLAYER1_WINS: cout << "Player 1 wins!" << endl;
                        break;
    case PLAYER2_WINS: cout << "Player 2 wins!" << endl;
                        break;
    case DRAW: cout << "Game drawn" << endl;
                        break;
  }
}
