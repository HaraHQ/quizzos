import ADLayout from "@/components/admin/Layout";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/SortableItem";
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Quiz } from "@/pages/api/admin/quiz/[share_id]";
import { data } from "framer-motion/client";
import useLocaleStore from "@/stores/locale";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  title: string;
  score: number;
  isScored: boolean;
  options: Option[];
}

const QuizEditById: React.FC = () => {
  const router = useRouter();
  const auth = useAuthStore();
  const l = useLocaleStore();

  const { id } = router.query;

  const [title, setTitle] = useState<string>("Quiz Title");
  const [description, setDescription] = useState<string>("Quiz Description");
  const [random, setRandom] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      title: "",
      score: 0,
      isScored: true,
      options: [{ id: uuidv7(), text: "", isCorrect: false }],
    },
  ]);
  const [updateData, setUpdateData] = useState<Quiz | null>(null);

  const [useScore, setUseScore] = useState<boolean>(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: "",
        score: 0,
        isScored: useScore,
        options: [{ id: uuidv7(), text: "", isCorrect: false }],
      },
    ]);
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, ...updatedQuestion } : question
      )
    );
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const submit = () => {
    
    const payload = {
      use_score: useScore,
      title,
      desc: description,
      questions,
      use_random: random,
    };

    // console.log(payload);
    update.mutate(payload);
  };

  // get data
  useQuery({
    queryKey: ["quiz", "detail", id],
    queryFn: async () => {
      const req = await fetch(`/api/admin/quiz/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
      });
      const res = await req.json();

      if (res) {
        setUpdateData(res);
      }

      return res;
    },

    refetchOnMount: false,
  });

  const update = useMutation({
    mutationFn: async (payload: Quiz) => {
      const req = await fetch(`/api/admin/quiz/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      if (res.error) console.log(res.error);
      if (res.message) alert(res.message);
    },
    onSuccess: () => {
      router.push('/admin/quiz')
    },
  });

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.desc);
      setRandom(updateData.use_random);
      setUseScore(updateData.use_score);
      setQuestions(updateData.questions);
    }
  }, [updateData])

  return (
    <ADLayout>
      <div className="grid grid-cols-8 gap-4 w-full">
        <div className="col-span-6 bg-white p-2 border-2 border-black rounded-xl flex flex-col gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;
              if (active?.id !== over?.id) {
                setQuestions((prev) =>
                  arrayMove(
                    prev,
                    prev.findIndex((item) => item.id === active.id),
                    prev.findIndex((item) => item.id === over?.id)
                  )
                );
              }
            }}
          >
            <SortableContext
              items={questions.map((question) => question.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {questions.map((question) => (
                  <div key={question.id} className="flex flex-col gap-4 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        className="outline-none p-2 text-xl w-full border-black border-2"
                        placeholder={l.gt('questionTitle')}
                        value={question.title}
                        onChange={(e) =>
                          updateQuestion(question.id, { title: e.target.value })
                        }
                      />
                      {useScore && (
                        <input
                          type="number"
                          className="outline-none p-2 text-xl w-[100px] border-black border-2 ml-4"
                          placeholder={l.gt('score')}
                          value={question.score}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              score: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      )}
                      <button
                        type="button"
                        className="ml-4 text-red-500"
                        onClick={() => removeQuestion(question.id)}
                      >
                        {l.gt('remove')}
                      </button>
                    </div>
                    <div>
                      <div className="text-sm mb-2">
                        {l.gt('answerOptions')}{" "}
                        <span className="italic text-red-800">
                          ({l.gt('maxOptions')})
                        </span>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event: DragEndEvent) => {
                          const { active, over } = event;
                          if (active?.id !== over?.id) {
                            updateQuestion(question.id, {
                              options: arrayMove(
                                question.options,
                                question.options.findIndex(
                                  (item) => item.id === active.id
                                ),
                                question.options.findIndex(
                                  (item) => item.id === over?.id
                                )
                              ),
                            });
                          }
                        }}
                      >
                        <SortableContext
                          items={question.options.map((option) => option.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-2">
                            {question.options.map((option) => (
                              <SortableItem
                                key={option.id}
                                id={option.id}
                                option={option}
                                onAdd={() => {
                                  if (question.options.length < 4) {
                                    updateQuestion(question.id, {
                                      options: [
                                        ...question.options,
                                        {
                                          id: uuidv7(),
                                          text: "",
                                          isCorrect: false,
                                        },
                                      ],
                                    });
                                  }
                                }}
                                onRemove={(id) =>
                                  updateQuestion(question.id, {
                                    options: question.options.filter(
                                      (opt) => opt.id !== id
                                    ),
                                  })
                                }
                                onToggleCorrect={(id) =>
                                  updateQuestion(question.id, {
                                    options: question.options.map((opt) =>
                                      opt.id === id
                                        ? {
                                            ...opt,
                                            isCorrect: !opt.isCorrect,
                                          }
                                        : { ...opt, isCorrect: false }
                                    ),
                                  })
                                }
                                onTextChange={(text: string) =>
                                  updateQuestion(question.id, {
                                    options: question.options.map((opt) =>
                                      opt.id === option.id
                                        ? { ...opt, text }
                                        : opt
                                    ),
                                  })
                                }
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded"
            onClick={addQuestion}
          >
            {l.gt('addQuestion')}
          </button>
        </div>
        <div className="col-span-2 bg-white h-full p-2 border-2 border-black rounded-xl flex flex-col gap-4">
          <div>
            <div className="text-sm">{l.gt('quizTitle')}</div>
            <input
              type="text"
              className="outline-none p-2 text-xl w-full border-black border-2"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div>
            <div className="text-sm">{l.gt('description')}</div>
            <textarea
              className="outline-none p-2 text-xl w-full border-black border-2 h-[125px]"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div>
            <input
              type="checkbox"
              checked={useScore}
              onChange={(e) => {
                setUseScore(e.target.checked);
                setQuestions((prev) =>
                  prev.map((q) => ({ ...q, isScored: e.target.checked }))
                );
              }}
              className="mr-2"
            />
            {l.gt('useScore')}
          </div>
          <div>
            <input
              type="checkbox"
              checked={random}
              onChange={(e) => {
                setRandom(e.target.checked);
              }}
              className="mr-2"
            />
            {l.gt('useRandom')}
          </div>
          <div className="flex flex-col gap-2">
            <Link href={'/admin/quiz'} className="text-center bg-black text-white p-4 shadow-md cursor-pointer">
              {l.gt('backToMyQuizzes')}
            </Link>
            <div className="text-center bg-red-700 text-white p-4 shadow-md cursor-pointer" onClick={() => submit()}>
              {l.gt('submitQuiz')}
            </div>
          </div>
        </div>
      </div>
    </ADLayout>
  );
};

export default QuizEditById;
