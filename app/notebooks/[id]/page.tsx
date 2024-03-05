'use client'
import { Notebook } from "@/app/page";
import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import QuizIcon from '@mui/icons-material/Quiz';
import Link from "next/link";
import React, {useEffect, useState} from "react";

interface Props {
    params: {
        id: number
    }
}

interface Example {
    id: number;
    exampleText: string;
}

interface Word {
    id: number;
    word: string;
    pos: string;
    pronunciation: string;
    definition: string;
    examples: Example[];
}

export default function NotebookContents({ params: {id} }: Props) {
    const [notebook, setNotebook] = useState<Notebook | undefined>(undefined);
    const [words, setWords] = useState<Word[]>([]);

    const [testCollectionGenerationJobId, setTestCollectionGenerationJobId] = useState<number | undefined>(undefined);
    const [shouldFetchJobStatus, setShouldFetchJobStatus] = useState<boolean>(false);

    useEffect(() => {
        fetch(`http://localhost:8080/notebooks/${id}`)
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

        fetch(`http://localhost:8080/words/by-notebook/${id}`)
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
                setWords(data);
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }, []);

    const triggerTestCollectionGeneration = () : void => {
        fetch(`http://localhost:8080/test-collection-generation/trigger/for-notebook/${id}`, { method: "post"})
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
                setTestCollectionGenerationJobId(data.id);
                setShouldFetchJobStatus(true);
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }

    function fetchTestCollectionGenerationJobStatus(): void {
        if (testCollectionGenerationJobId) {
            fetch(`http://localhost:8080/test-collection-generation/status/${testCollectionGenerationJobId}`)
                .then(response => {
                    console.log('response: ', response);
                    if (!response.ok) {
                        throw new Error(`HTTP error, status = ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('data: ', data);
                    switch (data.status) {
                        case "COMPLETED":
                            setShouldFetchJobStatus(false);
                            break;
                        case "FAILED":
                            console.log("Test collection generation job has failed");
                            setShouldFetchJobStatus(false);
                            //show error
                            break;
                        default:
                            console.log("Different value" + data.status);
                            break;
                    }
                })
                .catch(error => {
                    console.log('error: ', error);
                    setShouldFetchJobStatus(false);
                });
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!shouldFetchJobStatus) {
                clearInterval(intervalId);
            }

            fetchTestCollectionGenerationJobStatus();
        }, 2000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [shouldFetchJobStatus]);



    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>{ notebook ? notebook.name : "Notebook not found"}</Typography>
            {notebook && <Typography color="text.secondary">{notebook.description}</Typography>}
            <Typography color="text.secondary">Number of words: {words.length}</Typography>
            <LoadingButton loading={shouldFetchJobStatus} onClick={() => triggerTestCollectionGeneration()} loadingPosition="start" startIcon={<QuizIcon/>} variant="contained" color="primary" sx={{ mt: 1 }} >
                Create Tests
            </LoadingButton>
            <Link href={`/tests/${notebook?.id}`} passHref>
                <Button variant="contained" color="primary" sx={{ mt: 1, ml: 1 }}>
                    Tests
                </Button>
            </Link>
            <Stack spacing={3} sx={{ mt: 2 }}>
                {words.map((word: Word) => (
                    <Card key={word.id} sx={{ boxShadow: 2}}>
                       <CardContent>
                           <Typography variant="h4" align="center">
                               {word.word}
                           </Typography>
                           {/*<Typography color="text.secondary" align="center">*/}
                           {/*    ({word.pos})*/}
                           {/*</Typography>*/}
                           {/*<Typography color="text.secondary" align="center">*/}
                           {/*    {word.pronunciation}*/}
                           {/*</Typography>*/}
                           <Typography variant="h6" color="text.secondary" align="center">
                               {word.definition}
                           </Typography>
                           {word?.examples?.length > 0 &&
                               <Typography variant="subtitle1" color="text.secondary">
                                   Examples:
                               </Typography>
                           }
                           {word.examples.map((example: Example) => (
                               <Typography key={example.id} color="text.secondary">
                                   {example.exampleText}
                               </Typography>
                           ))}
                       </CardContent>
                    </Card>
                ))}
                <Link href={`/notebooks/${id}/word/new`} passHref>
                    <Button variant="contained" color="primary">
                        Create New Word
                    </Button>
                </Link>
            </Stack>
        </Box>);
}