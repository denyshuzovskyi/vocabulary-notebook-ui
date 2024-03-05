"use client"
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {useParams, useRouter } from "next/navigation";
import React, { useState } from "react";


interface NewWord {
    word: string;
    pos: string;
    pronunciation: string;
    definition: string;
    examples: { exampleText: string }[];
    notebookId: number;
}

export default function CreateWord() {
    const params = useParams<Params>()
    const router = useRouter();

    const initialFormValues: NewWord = {
        word: "",
        pos: "",
        pronunciation: "",
        definition: "",
        examples: [],
        notebookId: params.id,
    };

    const [wordData, setWordData] = useState<NewWord>(initialFormValues);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setWordData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleExampleChange = (
        index: number,
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { value } = event.target;
        setWordData((prevValues) => {
            const updatedExamples = [...prevValues.examples];
            updatedExamples[index] = { exampleText: value };
            return {
                ...prevValues,
                examples: updatedExamples,
            };
        });
    };

    const handleAddExample = () => {
        setWordData((prevValues) => ({
            ...prevValues,
            examples: [...prevValues.examples, { exampleText: "" }],
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", wordData);
        submitData();
    };

    const submitData = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("http://localhost:8080/words", {
            method: "post",
            headers: myHeaders,
            body: JSON.stringify(wordData),
        })
            .then((response) => {
                console.log("response: ", response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("data: ", data);
            })
            .catch((error) => {
                console.log("error: ", error);
            })
            .finally(() => {
                router.push(`/notebooks/${params.id}`);
            });
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" textAlign="center">
                Create new word
            </Typography>
            <Stack
                component="form"
                spacing={2}
                onSubmit={handleSubmit}
                sx={{ width: "300px", mt: 2, mx: "auto" }}
            >
                <TextField
                    label="Word"
                    name="word"
                    value={wordData.word}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Part of Speech (POS)"
                    name="pos"
                    value={wordData.pos}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Pronunciation"
                    name="pronunciation"
                    value={wordData.pronunciation}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Definition"
                    name="definition"
                    value={wordData.definition}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                />
                {wordData.examples.map((example, index) => (
                    <TextField
                        key={index}
                        label={`Example ${index + 1}`}
                        value={example.exampleText}
                        onChange={(event) => handleExampleChange(index, event)}
                        margin="normal"
                        multiline
                    />
                ))}
                <Button variant="outlined" color="primary" onClick={handleAddExample}>
                    Add Example
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}