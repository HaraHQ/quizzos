# QUIZZOS

## How to Install

- You can clone this repository first, and then install using `npm` or `yarn`, specifically I use `npm` but it's up to you to install the module first.
- Setup the `.env` file, just by look the example `.env.example` and fill by your own configuration based on `.env` file

## What you need to do

- Make database `quizzes`, `responses` and `users`
- The SQL code provided on below:

```SQL
CREATE TABLE "public"."quizzes" (
    "id" TEXT PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "use_random" BOOLEAN NOT NULL,
    "use_score" BOOLEAN NOT NULL,
    "questions" JSONB NOT NULL,
    "share_id" TEXT
);
```

```SQL
CREATE TABLE "public"."responses" (
    "id" TEXT PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL
);
```

```SQL
CREATE TABLE "public"."users" (
    "id" TEXT PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "locale" TEXT NOT NULL
);
```

## How to Use

After create the supabase table, and you provide the `.env` value as per it's key. Then you can run it by `npm run dev`.

## Features

- I made this as per request for Technical Interview of Tadsheen.
- It has Landing Page `/` with login and registration system, auth using `JWT` thru REST API
- You can login after registration, on demo site at vercel, you can use `rizki1` to `rizki5` with default password `1234`
- After login, you will have 3 things, `input the quiz id`, `get quiz button after input the quiz id` and `make quiz`
- After click `get quiz` you will moved to preview of quiz
- Then you can start to run the quiz
- After finish the quiz, you will transported into `quiz summary`, that give you information about, `how long it takes to response` the question and `how much correct answer(s)`, *all the share button is just **dummies***
- **If** you choose to `make quiz`, you will transported into `backoffice` or `admin page`
- In admin page, you can set you localization (which stored into `users`), so whenever you go back to frontend, your preference will use `language` based on your preferenced locale (currently support EN and AR, *i pick AR as arabic*)
- In admin page, you can access the `quizzes list` (because it's simple quiz, so *I don't set the quiz list based on user id*, so it's still load all quiz from all user made); then, user can update the quiz including the questions (*you can drag n drop the options*), you can type the `title`, `description`, `use random sequence` (it will applied when take the quiz on frontend), ~~use score~~ is just first time idea but I don't make it for more faster development
- In admin page, you also can see the `response from other user including you`, even you can check their answers and find out `the answers per question`, and find out its `correct` or `not` (*for better visibility of responders*)
- In admin page, specifically on quiz list, you can click the icon on `card`, on top will show you the `quiz responses detail` (data grid as data table), the bottom one to show `quiz id`

## Tools

- VSCode
- Next.js + Tailwind
- Zustand
- React Query
- Typescript
- Amazon Q (AI)
- ChatGPT (AI)