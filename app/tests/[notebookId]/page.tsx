"use client"
import {Box, Typography} from '@mui/material';
import React, {useEffect, useState} from "react";
import Quiz from '../../components/quiz/Quiz';
import QuizResult from '../../components/quiz/QuizResult';
import {useParams, useRouter} from "next/navigation";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import { Notebook } from '../../page';

interface TestOptionView {
    id: number,
    option: string,
    isCorrect: boolean
}

export interface TestView {
    id: number,
    task: string,
    testOptions: TestOptionView[],
    createdAt: string
}

interface TestCollectionView {
    id: number,
    notebookId: number,
    tests: TestView[],
    createdAt: string
}

const QuizExample: React.FC = () => {
    const params = useParams<Params>()
    const router = useRouter();

    const [notebook, setNotebook] = useState<Notebook | null>(null);
    const [testCollection, setTestCollection] = useState<TestCollectionView | null>(null);
    const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);
    const [currentSelectedOptionId, setCurrentSelectedOptionId] = useState<number | null>(null);


    const [score, setScore] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);

    useEffect(() => {
        fetch(`http://localhost:8080/notebooks/${params.notebookId}`)
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
                setNotebook(data);
            })
            .catch(error => {
                console.log('error: ', error);
            });

        fetch(`http://localhost:8080/test-collections/by-notebook/${params.notebookId}`)
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
                setTestCollection(data);
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }, []);


    const currentQuestion = testCollection?.tests[currentTestIndex];

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSelectedOptionId(parseInt((event.target as HTMLInputElement).value));
    };

    const handleNextQuestion = () => {
        if (currentQuestion?.testOptions.find(option => option.id === currentSelectedOptionId)?.isCorrect) {
            setScore(score + 1);
        }
        setCurrentSelectedOptionId(null);
        if (testCollection?.tests?.length && (currentTestIndex +  1 < testCollection?.tests?.length)) {
            setCurrentTestIndex(currentTestIndex + 1);
        } else {
            setShowResult(true);
        }
    };



    const resetQuiz = () => {
        setCurrentTestIndex(0);
        setCurrentSelectedOptionId(null);
        setScore(0);
        setShowResult(false);
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>Quiz</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Notebook: {notebook?.name}</Typography>
            {
                showResult ? (
                    <QuizResult
                        numberOfCorrectAnswers={score}
                        totalNumberOfQuestions={testCollection?.tests?.length ?? 0}
                        onEndQuizClick={resetQuiz}
                    />
                ) : (
                    <Quiz
                        quiz={testCollection?.tests[currentTestIndex]!}
                        selectedOptionId={currentSelectedOptionId ?? 0}
                        onOptionChange={handleOptionChange}
                        onNextClick={handleNextQuestion}
                    />
                )
            }
        </Box>
    );
};

export default QuizExample;
