-- CreateEnum
CREATE TYPE "public"."GamePhase" AS ENUM ('LOBBY', 'PLAYING', 'BETWEEN_ROUNDS', 'RESULTS', 'FINISHED');

-- CreateTable
CREATE TABLE "public"."games" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "gamePhase" "public"."GamePhase" NOT NULL DEFAULT 'LOBBY',
    "timerEndsAt" TIMESTAMP(3),
    "showResults" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#ff5544',

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answers" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "roundId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_code_key" ON "public"."games"("code");

-- CreateIndex
CREATE UNIQUE INDEX "answers_gameId_teamId_roundId_questionId_key" ON "public"."answers"("gameId", "teamId", "roundId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."teams" ADD CONSTRAINT "teams_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
