-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromptRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "rawPrompt" TEXT NOT NULL,
    "packKey" TEXT,
    "clarifiers" JSONB NOT NULL,
    "clarifierAnswers" JSONB NOT NULL,
    "optimizedPrompt" TEXT NOT NULL,
    "ranOpenAI" BOOLEAN NOT NULL DEFAULT false,
    "ranAnthropic" BOOLEAN NOT NULL DEFAULT false,
    "ranGoogle" BOOLEAN NOT NULL DEFAULT false,
    "resultOpenAI" TEXT,
    "resultAnthropic" TEXT,
    "resultGoogle" TEXT,
    "metrics" JSONB,

    CONSTRAINT "PromptRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "kind" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PromptRecord" ADD CONSTRAINT "PromptRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
