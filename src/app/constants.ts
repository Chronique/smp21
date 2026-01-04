// src/app/constants.ts
export const CONTRACT_ADDRESS = "0xCcD3Da8D322320Dc5A47944B1e8aBbe27EB1bB18";

export const CLASS_VOTE_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"address[]","name":"students","type":"address[]"}],"name":"addToWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"photoUrl","type":"string"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"photos","type":"string[]"}],"name":"createPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"photoUrl","type":"string"},{"internalType":"uint256","name":"votes","type":"uint256"}],"internalType":"struct ClassVoteV2.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"pollCreated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}
] as const;